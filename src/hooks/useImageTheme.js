"use client";

import { useState, useEffect } from 'react';

export default function useImageTheme(imageUrl) {
    const [themeRgb, setThemeRgb] = useState('37, 99, 235');

    
    useEffect(() => {
        if (!imageUrl) return;

        const img = new Image();
        img.crossOrigin = "Anonymous"; 
        img.src = imageUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = 50; 
            canvas.height = 50;
            ctx.drawImage(img, 0, 0, 50, 50);

            const data = ctx.getImageData(0, 0, 50, 50).data;
            let r = 0, g = 0, b = 0, count = 0;

            for (let i = 0; i < data.length; i += 16) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                count++;
            }

            setThemeRgb(`${Math.round(r/count)}, ${Math.round(g/count)}, ${Math.round(b/count)}`);
        };
    }, [imageUrl]);


    return themeRgb;
}