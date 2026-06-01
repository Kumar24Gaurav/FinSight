from flask_cors import CORS
import os
from dotenv import load_dotenv
from flask import Flask
from flask_jwt_extended import JWTManager

from routes import api

load_dotenv()

def create_app():
    app = Flask(
        __name__,
        static_folder="static",
        static_url_path=""
    )

    CORS(app, origins=["http://localhost:5173"])

    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

    JWTManager(app)

    app.register_blueprint(api, url_prefix="/api")

    @app.route("/")
    def home():
        return app.send_static_file("index.html")

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
