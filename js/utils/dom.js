class DOMUtils {
    static createElement(tag, classes = '', content = '') {
        const element = document.createElement(tag);
        if (classes) element.className = classes;
        if (content) element.innerHTML = content;
        return element;
    }

    static show(element) {
        element.style.display = 'block';
    }

    static hide(element) {
        element.style.display = 'none';
    }

    static toggle(element) {
        if (element.style.display === 'none') {
            this.show(element);
        } else {
            this.hide(element);
        }
    }

    static addClass(element, className) {
        element.classList.add(className);
    }

    static removeClass(element, className) {
        element.classList.remove(className);
    }

    static toggleClass(element, className) {
        element.classList.toggle(className);
    }

    static getById(id) {
        return document.getElementById(id);
    }

    static query(selector) {
        return document.querySelector(selector);
    }

    static queryAll(selector) {
        return document.querySelectorAll(selector);
    }

    static on(event, selector, callback) {
        document.addEventListener(event, function(e) {
            if (e.target.matches(selector)) {
                callback(e);
            }
        });
    }

    static loadHTML(elementId, url) {
        return fetch(url)
            .then(response => response.text())
            .then(html => {
                document.getElementById(elementId).innerHTML = html;
            })
            .catch(error => console.error('Error loading HTML:', error));
    }
}