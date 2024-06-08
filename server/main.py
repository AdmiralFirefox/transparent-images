from flask import Flask, jsonify, request, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os
import shutil

# App instance
app = Flask(__name__)
CORS(app)

# Define the upload folder path
UPLOAD_FOLDER = "uploads"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# Check if the upload folder exists and create it if it doesn't
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
else:
    print(f"{UPLOAD_FOLDER} folder already exists.")


# Delete all old uploaded images
def clear_old_images():
    for filename in os.listdir(UPLOAD_FOLDER):
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f'Failed to delete {file_path}. Reason: {e}')


# Setting up endpoint
@app.route("/api/remove-bg", methods=["POST"])
def remove_bg():
    clear_old_images()

    # Get Images from the client
    input_image = request.files.get("imageFile")

    if input_image:
        filename = secure_filename(input_image.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        input_image.save(file_path)

        return jsonify({
            "uploaded_image": filename,
        })


@app.route('/api/get-image/<filename>', methods=["GET"])
def get_image(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    return send_file(file_path, mimetype='image/png')


if __name__ == "__main__":
    app.run(debug=True, port=8000)

