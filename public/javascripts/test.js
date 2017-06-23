function getPixels(img, type)
{

  var item = document.getElementById("receptacle");
  var newColor = {R:0,G:0,B:255};

  if (type == "wall"){
    item = document.getElementById("wall");
    newColor = {R:255,G:0,B:0};

  }

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var originalPixels = null;
  var currentPixels = null;


  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
  originalPixels = ctx.getImageData(0, 0, img.width, img.height);
  currentPixels = ctx.getImageData(0, 0, img.width, img.height);

  img.onload = null;

  if(!originalPixels) return; // Check if image has loaded
  for(var I = 0, L = originalPixels.data.length; I < L; I += 4)
    {
        if(currentPixels.data[I + 3] > 0) // If it's not a transparent pixel
        {
              currentPixels.data[I] = newColor.R;
              currentPixels.data[I + 1] = newColor.G;
              currentPixels.data[I + 2] = newColor.B;
        }
    }

    ctx.putImageData(currentPixels, 0, 0);
    item.src = canvas.toDataURL("image/png");
}
