# Instagram Follower Analyzer

## Description

Instagram Follower Analyzer is a web application that allows users to analyze their Instagram followers/following to identify:

- **Users who do not follow you back**
- **Accounts you do not follow back**

The analysis is performed using a C program hosted on Heroku, providing a seamless experience without the need for local installation or compilation.

Note: The Heroku dyno may be asleep when first visiting the app. The initial page load or first request can take up to ~1 minute to start the dyno.

## Table of Contents

- [Features](#features)
- [Accessing the Web Application](#accessing-the-web-application)
- [Running Locally](#running-locally)
- [Downloading Instagram Data](#downloading-instagram-data)
- [Uploading Your Data (ZIP or JSON)](#uploading-your-data-zip-or-json)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Upload Instagram ZIP directly:** Upload the Instagram "Download your information" ZIP; the server extracts the correct files automatically (recommended). Supports both JSON and HTML exports.
- **Upload Followers and Following JSON/HTML:** Alternatively, upload the two files manually in either JSON or HTML format.
- **Identify Non-Mutual Connections:** Get clear lists of who doesn't follow you back and whom you don't follow back.
- **Web-Based Analyzer:** Access the tool directly through a web interface without the need for local setup.

## Accessing the Web Application

You can access the Instagram Follower Analyzer directly through the following link:

[Instagram Follower Analyzer on Heroku](https://instagram-checker-b38e2b3eb69a.herokuapp.com/)

This web application allows you to upload your Instagram ZIP or JSON files and view the analysis results online.

Cold start: If the site seems slow to respond at first, it’s likely starting the Heroku dyno. Give it up to ~1 minute and it will speed up after that.

## Running Locally

To run the application locally, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/instagram-follower-analyzer.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd instagram-follower-analyzer
   ```

3. **Install Dependencies:**

   Navigate to the client directory and install the necessary npm packages:

   ```bash
   cd client
   npm install
   ```

4. **Start the Client:**

   Run the following command to start the client-side application:

   ```bash
   npm start
   ```

5. **Start the Server:**

   If you have a server component, navigate to the server directory and start the server:

   ```bash
   cd ../server
   python app.py
   ```

   Ensure that any necessary environment variables are set up for the server to run correctly.

## Downloading Instagram Data

To analyze your Instagram followers and following, you need to download your data from Instagram. Follow these steps:

1. **Open Instagram App:**

   Tap the <img alt="profile" src="https://static.xx.fbcdn.net/assets/?revision=1946921019013361&amp;name=instagram-user-profile&amp;density=1" width="20"/> icon in the bottom right to go to your profile.

2. **Access More Options:**

   Tap the <img alt="more options" src="https://static.xx.fbcdn.net/assets/?revision=1946921019013361&amp;name=instagram-hamburger-ios&amp;density=1" width="20"/> icon in the top right, then tap <img alt="activity controls" src="https://static.xx.fbcdn.net/assets/?revision=1946921019013361&amp;name=instagram-youractivity-shared&amp;density=1" width="20"/> **Your activity**.

3. **Download Your Information:**

   - Under **Information you shared with Instagram**, tap <img alt="download your information" src="https://static.xx.fbcdn.net/assets/?revision=1946921019013361&amp;name=instagram-downloadinformation-shared&amp;density=1" width="20"/> **Download your information**.
   
   - **Request a Download:**
     1. Enter your email address where you'd like to receive the download link.
     2. Tap **Request a download**.

   - **Select Information:**
     1. Choose **Select types of information**.
     2. Scroll down and select **Followers and following**.

   - **Select File Options:**
     1. **Format:** JSON
     2. **Date Range:** All time

   - **Submit Request:**
     Tap **Submit request**.

4. **Receive Download Link:**

   You'll receive an email titled "Your Instagram Data" with a link to download your data. This might take up to 24 hours.

Quick link: You can also open the official download page directly here:

https://accountscenter.instagram.com/info_and_permissions/dyi/?entry_point=notification

The web app includes a guided tutorial (step‑by‑step) that opens this link for you and walks you through each step.

## Uploading Your Data (ZIP or JSON)

Option A — Upload the ZIP (recommended):

1. Request your data from Instagram as described below.
2. When you receive the email, download the ZIP file.
3. In the web app, choose "Upload Instagram ZIP" and upload the ZIP directly. The server will locate followers/following in JSON or HTML and run the analysis.

Option B — Upload the files manually (JSON or HTML):

1. Extract the ZIP locally.
2. Find the two files in the export (often under `connections/followers_and_following/`):
   - `followers.json` or `followers.html`
   - `following.json` or `following.html`
3. In the web app, choose the manual upload option and select both files.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository.**

2. **Create a New Branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit Your Changes:**

   ```bash
   git commit -m "Add some feature"
   ```

4. **Push to the Branch:**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request.**

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
