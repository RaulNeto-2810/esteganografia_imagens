from flask import Flask
from flask.cli import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__, 
                static_folder='../static',
                template_folder='../templates')
                
    from app.esteganografia import bp as esteganografia_bp
    app.register_blueprint(esteganografia_bp)
    
    return app
