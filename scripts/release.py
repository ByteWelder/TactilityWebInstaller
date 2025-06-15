#!/bin/python

import os
import sys
import shutil
import zipfile

if sys.platform == "win32":
    shell_color_red = ""
    shell_color_orange = ""
    shell_color_green = ""
    shell_color_reset = ""
else:
    shell_color_red = "\033[91m"
    shell_color_orange = "\033[93m"
    shell_color_green = "\033[32m"
    shell_color_reset = "\033[m"

def print_warning(message):
    print(f"{shell_color_orange}WARNING: {message}{shell_color_reset}")

def print_error(message):
    print(f"{shell_color_red}ERROR: {message}{shell_color_reset}")

def exit_with_error(message):
    print_error(message)
    sys.exit(1)

if __name__ == "__main__":
    # Argument validation
    if len(sys.argv) == 1:
        exit_with_error("Missing argument: device identifier")

    device = sys.argv[1]
    zip_filepath = f"Tactility-{device}.zip"

    target_path = device
    if (os.path.exists(target_path)):
        shutil.rmtree(target_path)
    os.mkdir(target_path)

    with zipfile.ZipFile(zip_filepath) as zip:
        for zip_info in zip.infolist():
            if zip_info.is_dir():
                continue
            zip_info.filename = os.path.basename(zip_info.filename)
            if zip_info.filename.endswith(".bin"):
                zip.extract(zip_info, target_path)