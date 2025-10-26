from flask import Blueprint
from controllers import user_controller

user_bp = Blueprint("user", __name__)

user_bp.route("/login", methods=["GET", "POST"])(user_controller.login)
user_bp.route("/signup", methods=["GET", "POST"])(user_controller.signup)
user_bp.route("/logout", methods=["GET"])(user_controller.logout)