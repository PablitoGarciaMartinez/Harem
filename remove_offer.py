import sys
import os

file_path = r"c:\Users\pablo\Desktop\tienda-mrchucots\index.html"

try:
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    if "pack-2x1-container" in lines[71]:
        del lines[71:153]
        
        # Update the available cards count from 12 to 10
        for i, line in enumerate(lines):
            if "12 cartas disponibles" in line:
                lines[i] = line.replace("12 cartas disponibles", "10 cartas disponibles")
                break
                
        with open(file_path, "w", encoding="utf-8") as f:
            f.writelines(lines)
        print("Success: Removed offer and updated card count.")
    else:
        print("Error: Line 72 does not match expectations. It is:", lines[71].strip())
        
except Exception as e:
    print(f"Error: {e}")
