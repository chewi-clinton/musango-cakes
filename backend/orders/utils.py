from urllib.parse import quote

from storeinfo.models import StoreInfo


def whatsapp_link(message: str) -> str:
    number = StoreInfo.load().whatsapp_number.replace("+", "").replace(" ", "")
    return f"https://wa.me/{number}?text={quote(message)}"


def build_order_message(order) -> str:
    lines = [f"Hi {StoreInfo.load().business_name}, I'd like to place this order:"]
    for item in order.items.all():
        variant = item.variant
        bits = " / ".join(b for b in [variant.size, variant.flavor, variant.color] if b)
        lines.append(f"- {item.quantity} x {item.product.name} ({bits}) — {variant.price} FCFA")
    lines.append(f"Fulfillment: {order.get_fulfillment_type_display()}")
    if order.customer:
        lines.append(f"Name: {order.customer.name}")
        lines.append(f"Phone: {order.customer.phone}")
    return "\n".join(lines)


def build_custom_order_message(request_obj) -> str:
    lines = [
        f"Hi {StoreInfo.load().business_name}, I'd like a custom cake quote:",
        f"Size: {request_obj.size}",
        f"Flavor: {request_obj.flavor}",
    ]
    if request_obj.date_needed:
        lines.append(f"Date needed: {request_obj.date_needed}")
    lines.append(f"Fulfillment: {request_obj.get_fulfillment_type_display()}")
    if request_obj.special_instructions:
        lines.append(f"Notes: {request_obj.special_instructions}")
    if request_obj.customer:
        lines.append(f"Name: {request_obj.customer.name}")
        lines.append(f"Phone: {request_obj.customer.phone}")
    return "\n".join(lines)
