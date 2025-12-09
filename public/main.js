const btn = document.getElementById('helloBtn');
const message = document.getElementById('message');

btn.addEventListener('click', async () => {
  message.textContent = 'Loading...';
  try {
    const res = await fetch('/api/hello');
    const json = await res.json();
    message.textContent = json.message;
  } catch (err) {
    message.textContent = 'Error calling API';
  }
});
