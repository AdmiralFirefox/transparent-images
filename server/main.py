from flask import Flask, jsonify, request, send_file, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os
import shutil
from PIL import Image
from rembg import remove

# App instance
app = Flask(__name__)
CORS(app)

# Define the upload folder path
UPLOAD_FOLDER = "uploads"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Define the output folder path
OUTPUT_FOLDER = "output"
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER


# Check if the upload folder exists and create if it doesn't
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
else:
    print(f"{UPLOAD_FOLDER} folder already exists.")


# Check if the output folder exists and create if it doesn't
if not os.path.exists(OUTPUT_FOLDER):
    os.makedirs(OUTPUT_FOLDER)
else:
    print(f"{OUTPUT_FOLDER} folder already exists.")


# Delete all old uploaded images
def clear_old_images():
    # Clear image for upload folder
    for filename in os.listdir(UPLOAD_FOLDER):
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f'Failed to delete {file_path}. Reason: {e}')
    
    # Clear image for output folder
    for filename in os.listdir(OUTPUT_FOLDER):
        file_path = os.path.join(OUTPUT_FOLDER, filename)
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

        filename_noextension = os.path.splitext(filename)[0]
        output_image_name = f"transparent_{filename_noextension}.png"

        transparent_input_image = Image.open(file_path)
        transparent_output_image = remove(transparent_input_image)

        transparent_output_image.save(f"{OUTPUT_FOLDER}/{output_image_name}")

        return jsonify({
            "transparent_image": f"{output_image_name}",
            "download_url": f"/api/download-image/{output_image_name}"
        })


@app.route('/api/transparent-image/<filename>', methods=["GET"])
def transparent_image(filename):
    file_path = os.path.join(app.config['OUTPUT_FOLDER'], filename)
    return send_file(file_path, mimetype='image/png')


@app.route('/api/download-image/<filename>', methods=["GET"])
def download_image(filename):
    return send_from_directory(OUTPUT_FOLDER, filename, as_attachment=True)


if __name__ == "__main__":
    app.run(debug=True, port=8000)

