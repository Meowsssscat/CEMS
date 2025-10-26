from flask import Blueprint
from controllers import osas_event_management_controller

osas_event_management_bp = Blueprint("osas_event_management", __name__)

osas_event_management_bp.route("/osas/event-management", methods=["GET"])(osas_event_management_controller.view_all_events)
osas_event_management_bp.route("/osas/cancel-event", methods=["GET"])(osas_event_management_controller.cancel_osas_event)
osas_event_management_bp.route("/osas/postpone-event", methods=["GET", "POST"])(osas_event_management_controller.postpone_osas_event)