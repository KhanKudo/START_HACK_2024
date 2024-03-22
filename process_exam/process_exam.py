import sys
import cv2
from pdf2image import convert_from_path
import numpy as np
from doctr.models import ocr_predictor
from typing import List
from io import BytesIO
from PIL import Image
import matplotlib.pyplot as plt
import json
import math
from itertools import groupby, product


def find_pattern(in_rgb, template, threshold):
    # Convert it to grayscale 
    img_gray = cv2.cvtColor(in_rgb, cv2.COLOR_BGR2GRAY) 

    # Store width and height of template in w and h 
    w, h = template.shape[::-1] 

    # Perform match operations. 
    res = cv2.matchTemplate(img_gray, template, cv2.TM_CCOEFF_NORMED) 

    # Store the coordinates of matched area in a numpy array 
    loc = np.where(res >= threshold)
    
    if len(loc[0]) == 0:
         return -1, -1, -1, -1
        
    #ymin = min(loc[0])
    #ymax = max(loc[0])
    #xmin = min(loc[1])
    #xmax = max(loc[1])

    return loc[0][0], loc[0][0]+h, loc[1][0], loc[1][0]+w 
#cv2.imwrite("out.png", img_rgb)
# Show the final image with the matched area. 
##plt.subplot(152),#plt.imshow(img_rgb)

def crop_table(in_rgb, box):
    
    c, w, h = in_rgb.shape[::-1]
    
    in_rgb = in_rgb[box[0]:box[1],box[2]:box[3],:]
    
    #print(in_rgb.shape[::-1])
    
    return in_rgb

def get_marks(img, templates, threshold):
    marksa = []
    marksb = []
    for x in templates:
        w, h = x.shape[:-1]
        #data = np.zeros((h, w, 3), dtype=np.uint8)

        templateGray = cv2.cvtColor(x, cv2.COLOR_BGR2GRAY)
        #cv2.imwrite("imghatGray.png", imghatGray)

        ret, mask = cv2.threshold(templateGray, 200, 255, cv2.THRESH_BINARY)
        #cv2.imwrite("orig_mask.png", orig_mask)

        #mask_inv = cv2.bitwise_not(mask)
        #mask_inv = cv2.cvtColor(mask_inv,cv2.COLOR_GRAY2RGB)


        ##plt.imshow(mask_inv)
        ##plt.show
        method = cv2.TM_CCOEFF_NORMED
        
        res = cv2.matchTemplate(img, x, method)
        
        tmp = np.where(res >= threshold)
        
        marksa.extend(tmp[0])
        marksb.extend(tmp[1])
    
    return (marksa, marksb)

def convert_coordinates(geometry, page_dim):
    len_x = page_dim[1]
    len_y = page_dim[0]
    (x_min, y_min) = geometry[0]
    (x_max, y_max) = geometry[1]
    x_min = math.floor(x_min * len_x)
    x_max = math.ceil(x_max * len_x)
    y_min = math.floor(y_min * len_y)
    y_max = math.ceil(y_max * len_y)
    return [x_min, x_max, y_min, y_max]
def get_coordinates(output):
    page_dim = output['pages'][0]["dimensions"]
    text_lines = [(str(""),[])]
    tmp_str = str("")
    conv_coord = []
    
    for obj1 in output['pages'][0]["blocks"]:
        for obj2 in obj1["lines"]:
            for obj3 in obj2["words"]:                
                
                if(obj3["value"] == "Ich"):
                    if(len(conv_coord)>0):
                        text_lines.append((tmp_str, conv_coord))
                    
                    tmp_str = str("")
                    conv_coord = [0,0,0,0]
                    
                    tmp_str = tmp_str + " " + obj3["value"]
                    
                    conv_coord = convert_coordinates(obj3["geometry"],page_dim)
                else:
                    tmp_str = tmp_str + " " + obj3["value"]
    return text_lines



color_pat = cv2.imread('template.png', 0)
mark_pat = cv2.imread('mark.png')
mark_pat_4 = cv2.imread('mark-4.png')
mark_pat_3 = cv2.imread('mark-3.png')
mark_pat_2 = cv2.imread('mark-2.png')
mark_mask_pat = cv2.imread('mark-mask.png')

results = []

file = sys.argv[1]
pages = convert_from_path(file)
i = 0
for page in pages:
    with BytesIO() as f:
        i = i + 1
        page.save(f, format="jpeg")
        page.save("p" + str(i) + ".jpg", format="jpeg")
        f.seek(0)
        file_bytes = np.asarray(bytearray(f.read()), dtype=np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        ## Pick table
        ymin, ymax, xmin, xmax = find_pattern(img, color_pat, 0.6)
        if(ymin == -1):
            break
        
        c, w, h = img.shape[::-1]
        imga = crop_table(img, [ymin, h, 0, xmin])

        #print(img.shape[::-1])
        
        #marks = get_marks(img, [mark_pat, mark_pat_2], 0.55)
        
        
        model = ocr_predictor(pretrained=True)
        # PDF        
        result = model([imga])
        
        #result.show()
        
        #synthetic_pages = result.synthesize()
        ##plt.imshow(synthetic_pages[0]); #plt.axis('off'); #plt.show()
        
        output = result.export()
        
        
        graphical_coordinates = get_coordinates(output)
        
        for sentences in graphical_coordinates:
            #print(sentences[0] + "\n");
            #print('{}'.format(sentences[1]) + "\n");
            
            if len(sentences[1]) > 0:
                #print(xmin)
                #print(xmax)
                top = ymin + sentences[1][3] + 15
                bottom = top + 30
                imgb = crop_table(img, [top, bottom, xmin, xmax])
                
                
                marks = get_marks(imgb, [mark_pat_2, mark_pat_3, mark_pat_4 ,mark_mask_pat], 0.3)
                
                
                mark1 = np.average(marks[1])
                mark0 = np.average(marks[0])
                
                score = mark1/((xmax-xmin)*0.9)

                #print(score)
                ##plt.imshow(imgb);
                ##plt.scatter(mark1, mark0)
                ##plt.show();
                                
                results.append((sentences[0], score))
                
        # Convert tuple to JSON
        json_data = json.dumps(results)

# Display the result
print(json_data)