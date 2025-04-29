/* 差分画像をJSで生成 */

function loadImageUrl(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
}

function loadImageFile(file) {
  
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = URL.createObjectURL(file);
  });
}

function validateImages(img1, img2, ctx1, ctx2) {
  if (img1.width !== img2.width || img1.height !== img2.height) {
    throw new Error('画像サイズが異なります');
  }

  const width = img1.width;
  const height = img1.height;

  ctx1.canvas.width = width;
  ctx1.canvas.height = height;
  ctx2.canvas.width = width;
  ctx2.canvas.height = height;

  ctx1.drawImage(img1, 0, 0);
  ctx2.drawImage(img2, 0, 0);

  const data1 = ctx1.getImageData(0, 0, width, height);
  const data2 = ctx2.getImageData(0, 0, width, height);

  if (data1.data.length !== data2.data.length) {
    throw new Error('ピクセルデータ長が異なります');
  }

  if (data1.colorSpace !== data2.colorSpace) {
    throw new Error('カラースペースが異なります');
  }

  return { width, height, data1, data2 };
}

function compareImages(data1, data2, width, height, diffCtx, options = {}) {
  const {
    threshold = 0,   // 許容差分 (0 = 完全一致のみ)
    highlightColor = [255, 0, 0, 255] // 差分表示色 (赤)
  } = options;

  const diffImage = diffCtx.createImageData(width, height);

  for (let i = 0; i < data1.data.length; i += 4) {
    const rDiff = Math.abs(data1.data[i]   - data2.data[i]);
    const gDiff = Math.abs(data1.data[i+1] - data2.data[i+1]);
    const bDiff = Math.abs(data1.data[i+2] - data2.data[i+2]);
    const aDiff = Math.abs(data1.data[i+3] - data2.data[i+3]);

    const totalDiff = rDiff + gDiff + bDiff + aDiff;

    if (totalDiff > threshold) {
      diffImage.data[i]   = highlightColor[0];
      diffImage.data[i+1] = highlightColor[1];
      diffImage.data[i+2] = highlightColor[2];
      diffImage.data[i+3] = highlightColor[3];
    } else {
      diffImage.data[i+3] = 0; // 完全透明
    }
  }

  diffCtx.putImageData(diffImage, 0, 0);
}


function main() {
// 実行部分
  (async () => {
    const [img1, img2] = await Promise.all([
      loadImage('image1.png'),
      loadImage('image2.png')
    ]);

    const canvas1 = document.createElement('canvas');
    const canvas2 = document.createElement('canvas');
    const diffCanvas = document.createElement('canvas');
    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    const diffCtx = diffCanvas.getContext('2d');

    try {
      const { width, height, data1, data2 } = validateImages(img1, img2, ctx1, ctx2);
      diffCanvas.width = width;
      diffCanvas.height = height;

      compareImages(data1, data2, width, height, diffCtx, {
        threshold: 10,             // 誤差許容（0〜1020まで、通常10〜50程度でよい）
        highlightColor: [0, 255, 0, 255] // 差分を緑色で表示する例
      });

      document.body.appendChild(diffCanvas);
    } catch (e) {
      console.error(e.message);
    }
  })();

}