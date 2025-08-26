from flask import Flask, request, jsonify, send_from_directory
import os
import subprocess
import json
import stat
import requests
import zipfile
import tempfile
import io

# Adjust BASE_DIR to point to the parent directory of 'server'
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Updated STATIC_FOLDER path
STATIC_FOLDER = os.path.join(BASE_DIR, 'client', 'build')

# Path to the C executable
C_EXECUTABLE = os.path.join(BASE_DIR, 'backend', 'instagram-Checker')

if not os.path.exists(C_EXECUTABLE):
    raise FileNotFoundError(f"C executable not found at {C_EXECUTABLE}")

st = os.stat(C_EXECUTABLE)
if not (st.st_mode & stat.S_IXUSR):
    raise PermissionError(f"C executable {C_EXECUTABLE} is not executable")

app = Flask(__name__, static_folder=STATIC_FOLDER, static_url_path='/')

app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'uploads')

# ensure uploads directory exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # Return index.html for all non-existing routes (for React Router)
        return send_from_directory(app.static_folder, 'index.html')

# endpoint to process followers/following files
@app.route('/api/check', methods=['POST'])
def check_followers():
    try:
        if 'following' not in request.files or 'followers' not in request.files:
            raise ValueError("Both following and followers files are required.")

        following_file = request.files['following']
        followers_file = request.files['followers']

        # save uploaded files
        following_path = os.path.join(app.config['UPLOAD_FOLDER'], 'following.json')
        followers_path = os.path.join(app.config['UPLOAD_FOLDER'], 'followers.json')
        following_file.save(following_path)
        followers_file.save(followers_path)

        # run C executable
        command = [C_EXECUTABLE, following_path, followers_path]
        print(f"Executing command: {' '.join(command)}")
        result = subprocess.run(command, capture_output=True, text=True)

        if result.returncode != 0:
            print(f"C program stdout: {result.stdout}")
            print(f"C program stderr: {result.stderr}")
            raise subprocess.CalledProcessError(result.returncode, command, result.stdout, result.stderr)

        # parse C program output
        output_lines = result.stdout.strip().split('\n')
        print('Output Lines:', output_lines) 

        not_following_back = []
        not_followed_by_you = []
        current_list = not_following_back

        for line in output_lines:
            print('Processing Line:', line)  
            if line == "People who follow you but you don't follow back:":
                current_list = not_followed_by_you
            elif line.endswith("does not follow you back."):
                username = line.split(' ')[0]
                print('Adding to not_following_back:', username)  
                current_list.append(username)
            elif line.endswith("is not followed by you."):
                username = line.split(' ')[0]
                print('Adding to not_followed_by_you:', username) 
                current_list.append(username)

        # clean up uploaded files
        os.remove(following_path)
        os.remove(followers_path)

        print('notFollowingBack:', not_following_back)  
        print('notFollowedByYou:', not_followed_by_you) 

        return jsonify({
            'notFollowingBack': not_following_back,
            'notFollowedByYou': not_followed_by_you
        })

    except subprocess.CalledProcessError as error:
        print(f"Error executing C code: {error}")
        print(f"C program stdout: {error.stdout}")
        print(f"C program stderr: {error.stderr}")
        return jsonify({'error': 'Failed to execute C code'}), 500
    except Exception as error:
        print(f"Error processing files: {error}")
        return jsonify({'error': 'An error occurred while processing the files.'}), 500


# endpoint to process a single Instagram ZIP export
@app.route('/api/check-zip', methods=['POST'])
def check_zip():
    try:
        if 'zip' not in request.files:
            raise ValueError("ZIP file is required (field name: 'zip').")

        zip_file = request.files['zip']

        # Read uploaded bytes to an in-memory buffer
        data = zip_file.read()
        if not data:
            raise ValueError("Uploaded ZIP is empty.")

        with zipfile.ZipFile(io.BytesIO(data)) as zf, tempfile.TemporaryDirectory() as tmpdir:
            namelist = zf.namelist()

            def pick_json(keyword):
                matches = []
                for name in namelist:
                    lower = name.lower()
                    base = os.path.basename(lower)
                    if not lower.endswith('.json'):
                        continue
                    if keyword not in base:
                        continue
                    # ignore unrelated files that sometimes appear
                    if any(bad in base for bad in ['recent', 'pending', 'requests', 'block']):
                        continue
                    matches.append(name)

                # Prefer exact filename if present (e.g., followers.json or following.json)
                preferred = [m for m in matches if os.path.basename(m).lower() == f"{keyword}.json"]
                if preferred:
                    return preferred[0]
                # Otherwise fall back to the first match in a stable order
                return matches[0] if matches else None

            followers_member = pick_json('followers')
            following_member = pick_json('following')

            if not followers_member or not following_member:
                raise ValueError(
                    "Could not locate both followers and following JSON in the ZIP. "
                    "Ensure you selected 'Followers and following' and JSON format in Instagram's export."
                )

            followers_path = os.path.join(tmpdir, 'followers.json')
            following_path = os.path.join(tmpdir, 'following.json')
            # Extract selected members to temp paths
            with zf.open(followers_member) as src, open(followers_path, 'wb') as dst:
                dst.write(src.read())
            with zf.open(following_member) as src, open(following_path, 'wb') as dst:
                dst.write(src.read())

            # run C executable
            command = [C_EXECUTABLE, following_path, followers_path]
            print(f"Executing command: {' '.join(command)}")
            result = subprocess.run(command, capture_output=True, text=True)

            if result.returncode != 0:
                print(f"C program stdout: {result.stdout}")
                print(f"C program stderr: {result.stderr}")
                raise subprocess.CalledProcessError(result.returncode, command, result.stdout, result.stderr)

            # parse C program output
            output_lines = result.stdout.strip().split('\n')
            print('Output Lines:', output_lines)

            not_following_back = []
            not_followed_by_you = []
            current_list = not_following_back

            for line in output_lines:
                print('Processing Line:', line)
                if line == "People who follow you but you don't follow back:":
                    current_list = not_followed_by_you
                elif line.endswith("does not follow you back."):
                    username = line.split(' ')[0]
                    if username:
                        current_list.append(username)
                elif line.endswith("is not followed by you."):
                    username = line.split(' ')[0]
                    if username:
                        current_list.append(username)

            return jsonify({
                'notFollowingBack': not_following_back,
                'notFollowedByYou': not_followed_by_you
            })

    except subprocess.CalledProcessError as error:
        print(f"Error executing C code: {error}")
        print(f"C program stdout: {error.stdout}")
        print(f"C program stderr: {error.stderr}")
        return jsonify({'error': 'Failed to execute C code'}), 500
    except Exception as error:
        print(f"Error processing ZIP: {error}")
        return jsonify({'error': str(error)}), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=port)
