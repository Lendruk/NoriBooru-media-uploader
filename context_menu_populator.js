const SERVER_URL = "http://127.0.0.1:8080";

async function getCurrentVault() {
  const storedSettings = await browser.storage.local.get();
  return storedSettings.selectedVault;
}

function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}


browser.contextMenus.create(
  {
    id: "upload_image",
    title: "Upload image to Nori vault",
    contexts: ["image"]
  },
  onCreated,
);

browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "upload_image":
      uploadImage(info.srcUrl);
      break;
  }
});

async function uploadImage(url) {
  const curWindow = await browser.windows.getCurrent();
  const res = await fetch(url, { mode: 'cors' });
  const blob = await res.blob(); 
  const formData = new FormData();
  formData.append(`image-0`, blob);
  const curVault = await getCurrentVault();

  await fetch(`${SERVER_URL}/mediaItems`, { method: 'POST', body: formData, headers: { "vault": curVault.id } })
}
