let currentVault = undefined;
let allVaults = [];
let instanceUrl = "";

async function setSelectedVault(vault) {
  currentVault = vault;
  await browser.storage.local.set({ selectedVault: vault });
  for(const otherVault of allVaults) {
    const node = document.getElementById(`vault_${otherVault.id}`);
    node.className = "";
  }
  const vaultNode = document.getElementById(`vault_${vault.id}`);
  vaultNode.className = "selected";
}

async function clearSelectedVault() {
  await browser.storage.local.set({ selectedVault: undefined });
}

async function setInstanceUrl(url) {
  instanceUrl = url;
  await browser.storage.local.set({ instanceUrl: url });
}

async function fetchVaults() {
  const response = await fetch(`${instanceUrl}/vaults`);
  const vaults = await response.json();
  const vaultContainer = document.getElementById("vault_container");

  for(const vault of vaults) {
    const newNode = document.createElement("button");
    newNode.innerText = `${vault.name}`;
    newNode.id = `vault_${vault.id}`;
    newNode.addEventListener('click', () => {
      setSelectedVault(vault);
    })
    vaultContainer.appendChild(newNode);
  }
  allVaults = vaults;
}

async function init() {
  const button = document.getElementById("set_vault_button");
  button.addEventListener("click", async () => {
    await setInstanceUrl(instanceUrlInput.value);
    await clearSelectedVault();
    await fetchVaults();
  });
  // Get vaults
  const instanceUrlInput = document.getElementById("instance_url_input");
  const storedSettings = await browser.storage.local.get();
  if (storedSettings.instanceUrl) {
    instanceUrl = storedSettings.instanceUrl;
    instanceUrlInput.value = instanceUrl;
    await fetchVaults();
    if(storedSettings.selectedVault) {
      setSelectedVault(storedSettings.selectedVault);
    } else {
      setSelectedVault(vaults[0]);
    }
  }
}

init();