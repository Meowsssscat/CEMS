from flask import Blueprint
from controllers import request_status_controller

request_status_bp = Blueprint("request_status", __name__)

request_status_bp.route("/department/request-status", methods=["GET"])(request_status_controller.view_request_status)
request_status_bp.route("/department/delete-request", methods=["GET"])(request_status_controller.delete_request)
request_status_bp.route("/department/edit-request", methods=["GET", "POST"])(request_status_controller.edit_request)
request_status_bp.route("/department/cancel-request", methods=["GET"])(request_status_controller.cancel_request)