async function check() {
    try {
        const res = await fetch('http://localhost:5000/');
        console.log('Root Status:', res.status);
        const text = await res.text();
        console.log('Root Text:', text);
    } catch (e) {
        console.error('Root Error:', e.message);
    }

    try {
        const res = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "Ping" })
        });
        console.log('Chat Status:', res.status);
        const data = await res.json();
        console.log('Chat Data:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Chat Error:', e.message);
    }
}
check();
