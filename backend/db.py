from flask_sqlalchemy import SQLAlchemy

# Single shared SQLAlchemy instance — imported wherever models or routes need it
db = SQLAlchemy()
