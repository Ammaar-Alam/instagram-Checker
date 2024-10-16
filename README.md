# Instagram Follower Analyzer

## Description

Instagram Follower Analyzer is a web application that allows users to download their Instagram followers and following data as JSON files and analyze them to identify:

- **Users who do not follow you back**
- **Accounts you do not follow back**

The analysis is performed using a C program hosted on Heroku, providing a seamless experience without the need for local installation or compilation.

## Table of Contents

- [Features](#features)
- [Accessing the Web Application](#accessing-the-web-application)
- [Downloading Instagram Data](#downloading-instagram-data)
- [Preparing JSON Files](#preparing-json-files)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Download Followers and Following Data:** Easily obtain your Instagram followers and following information in JSON format.
- **Identify Non-Mutual Connections:** Get clear lists of who doesn't follow you back and whom you don't follow back.
- **Web-Based Analyzer:** Access the tool directly through a web interface without the need for local setup.

## Accessing the Web Application

You can access the Instagram Follower Analyzer directly through the following link:

[Instagram Follower Analyzer on Heroku](https://instagram-checker-b38e2b3eb69a.herokuapp.com/)

This web application allows you to upload your JSON files and view the analysis results online.

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

## Preparing JSON Files

1. **Download the Data:**

   Click on the download link in your email and save the ZIP file to your computer.

2. **Extract the ZIP File:**

   ```bash
   unzip your_instagram_data.zip -d instagram_data
   ```

3. **Locate JSON Files:**

   After extraction, navigate to the `instagram_data` directory to find the following JSON files:

   - `followers.json`
   - `following.json`

   These files are required for analysis on the web application.

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
