from flask import Flask, request, jsonify, send_from_directory, render_template
import os
import subprocess
import json
import requests

# abs path to the directory w/ app.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# path to the client/build directory
STATIC_FOLDER = os.path.join(BASE_DIR, '..', 'client', 'build')

app = Flask(__name__, static_folder=STATIC_FOLDER, static_url_path='')

app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'uploads')

# ensure uploads directory exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# serve React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# endpoint to get pfp's
@app.route('/api/profile-pic/<username>', methods=['GET'])
def get_profile_pic(username):
    try:
        response = requests.get(f'https://www.instagram.com/{username}/?__a=1&__d=dis')
        response.raise_for_status()
        json_data = response.json()
        profile_pic_url = json_data['graphql']['user']['profile_pic_url_hd']
        return jsonify({'profilePicUrl': profile_pic_url})
    except Exception as error:
        print(f"Error fetching profile picture for {username}: {error}")
        return jsonify({'error': 'Failed to fetch profile picture'}), 500

# endpiont to process followers/following files
@app.route('/api/check', methods=['POST'])
def check_followers():
    try:
        if 'following' not in request.files or 'followers' not in request.files:
            raise ValueError("Both following and followers files are required.")
        
        following_file = request.files['following']
        followers_file = request.files['followers']
        
        following_data = json.load(following_file)
        followers_data = json.load(followers_file)
        
        result = process_json(following_data, followers_data)
        
        return jsonify(result)
    except Exception as error:
        print(f"Error processing files: {error}")
        return jsonify({'error': 'An error occurred while processing the files.'}), 500

def process_json(following_data, followers_data):
    following_array = following_data.get('relationships_following', following_data)
    followers_array = followers_data.get('relationships_followers', followers_data)

    following_map = {}
    for user in following_array:
        if 'string_list_data' in user and user['string_list_data']:
            data = user['string_list_data'][0]
            following_map[data['value']] = data['timestamp']

    followers_map = {}
    for user in followers_array:
        if 'string_list_data' in user and user['string_list_data']:
            data = user['string_list_data'][0]
            followers_map[data['value']] = data['timestamp']

    not_following_back = [
        {'username': user, 'timestamp': following_map[user]}
        for user in following_map if user not in followers_map
    ]

    not_followed_by_you = [
        {'username': user, 'timestamp': followers_map[user]}
        for user in followers_map if user not in following_map
    ]

    return {'notFollowingBack': not_following_back, 'notFollowedByYou': not_followed_by_you}

# endpoint to execute C
@app.route('/api/run-c', methods=['GET'])
def run_c_binary():
    try:
        result = subprocess.run(['./../backend/'], capture_output=True, text=True, check=True)
        return jsonify({'output': result.stdout})
    except subprocess.CalledProcessError as error:
        print(f"Error executing C code: {error}")
        return jsonify({'error': 'Failed to execute C code'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=port)
