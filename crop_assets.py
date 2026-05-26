from PIL import Image
import os

source_path = r"C:\Users\atifn\.cursor\projects\c-Users-atifn-OneDrive-All-Documents-GitHub-awaed-platform\assets\c__Users_atifn_AppData_Roaming_Cursor_User_workspaceStorage_1e05c74b5dd9c6a4d58785b9c65e1ca2_images_image-c22b5b9c-a462-4a08-9b42-b2aa11abce08.png"
assets_dir = r"c:\Users\atifn\OneDrive\All\Documents\GitHub\niyyah-app\assets"

if not os.path.exists(assets_dir):
    os.makedirs(assets_dir)

img = Image.open(source_path)

# 1. Dark App Icon (approx box: left, upper, right, lower)
# Visually estimated from 1024x1024
box_dark = (50, 650, 230, 830)
icon_dark = img.crop(box_dark)
# Make it exactly 1024x1024 as Expo expects for icon.png
icon_dark_resized = icon_dark.resize((1024, 1024), Image.Resampling.LANCZOS)
icon_dark_resized.save(os.path.join(assets_dir, "icon.png"))
icon_dark_resized.save(os.path.join(assets_dir, "adaptive-icon.png"))

# 2. Light App Icon
box_light = (275, 650, 455, 830)
icon_light = img.crop(box_light)
icon_light_resized = icon_light.resize((1024, 1024), Image.Resampling.LANCZOS)
icon_light_resized.save(os.path.join(assets_dir, "icon-light.png"))

# 3. Horizontal Logo
box_horizontal = (520, 650, 960, 830)
logo_horizontal = img.crop(box_horizontal)
logo_horizontal.save(os.path.join(assets_dir, "logo-horizontal.png"))

# 4. Splash Screen (Main top logo)
box_splash = (100, 100, 924, 550)
splash_logo = img.crop(box_splash)
# Expo splash should be a transparent PNG ideally, but we'll save the cropped one for now
splash_logo.save(os.path.join(assets_dir, "splash-icon.png"))

print("Cropped successfully!")
