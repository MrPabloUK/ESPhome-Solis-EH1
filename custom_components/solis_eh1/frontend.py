"""Serve and register the Lovelace schedule card."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import CARD_FILENAME, CARD_URL_PATH, DOMAIN, VERSION

_LOGGER = logging.getLogger(__name__)

WWW_DIR = Path(__file__).parent / "www"
DATA_FRONTEND = "frontend_registered"


async def async_register_frontend(hass: HomeAssistant) -> None:
    """Serve the card JS and register it as a Lovelace module resource."""
    store = hass.data.setdefault(DOMAIN, {})
    if store.get(DATA_FRONTEND):
        return

    await hass.http.async_register_static_paths(
        [StaticPathConfig(f"/{DOMAIN}", str(WWW_DIR), cache_headers=False)]
    )

    url = f"{CARD_URL_PATH}?v={VERSION}"
    lovelace = hass.data.get("lovelace")
    resources = getattr(lovelace, "resources", None) if lovelace is not None else None
    mode = getattr(lovelace, "mode", None) if lovelace is not None else None

    if resources is not None and mode != "yaml":
        if hasattr(resources, "async_load"):
            await resources.async_load()
        existing = None
        for item in resources.async_items():
            item_url = str(item.get("url", ""))
            if item_url.startswith(CARD_URL_PATH):
                existing = item
                break
        if existing is None:
            await resources.async_create_item({"res_type": "module", "url": url})
        elif existing.get("url") != url:
            await resources.async_update_item(existing["id"], {"res_type": "module", "url": url})
    else:
        add_extra_js_url(hass, url)
        _LOGGER.debug("Registered %s via extra JS URL (YAML Lovelace or no resource store)", CARD_FILENAME)

    store[DATA_FRONTEND] = True
