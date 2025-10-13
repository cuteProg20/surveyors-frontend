export async function loadLayout(){
    const headerUrl = new URL('./header.html', import.meta.url).toString();
    const sidebarUrl = new URL('./sidebar.html', import.meta.url).toString();

    try{
        const [headerRes, sidebarRes] = await Promise.all([
            fetch(headerUrl),
            fetch(sidebarUrl)
        ]);

        if (!headerRes.ok) {
            console.warn('Failed to load header:', headerRes.statusText, headerRes.statusText);
        } else {
            const headerHtml = await headerRes.text();
            const headerEl = document.getElementById('header');
            if(headerEl) headerEl.innerHTML = headerHtml;
        }
        if (!sidebarRes.ok) {
            console.warn('Failed to load sidebar:', sidebarRes.statusText, sidebarRes.statusText);
        } else {
            const sidebarHtml = await sidebarRes.text();
            const sidebarEl = document.getElementById('sidebar');
            if(sidebarEl) sidebarEl.innerHTML = sidebarHtml;
        }
    } catch (error) {
        console.error('Error loading layout:', error);
    }
}