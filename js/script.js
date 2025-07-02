/**
 * Il Mago Ristorante - Script principale
 * Gestisce la navigazione, il menu e le interazioni dell'utente
 */
document.addEventListener('DOMContentLoaded', function() {
    // Inizializzazione dell'applicazione
    initApp();
    
    /**
     * Inizializza tutte le funzionalità dell'applicazione
     */
    function initApp() {
        // Inizializza il menu mobile
        initMobileMenu();
        
        // Inizializza le categorie del menu se siamo nella pagina del menu
        if (document.getElementById('menuContainer')) {
            initMenuCategories();
        }
        
        // Inizializza il lazy loading se ci sono immagini
        if (document.querySelectorAll('img[loading="lazy"]').length > 0) {
            setupLazyLoading();
        }

        // Rimuovi eventuali testi "image.png" che potrebbero essere presenti nel codice
        removeImagePngText();
    }
    
    /**
     * Rimuove eventuali testi "image.png" che potrebbero essere presenti nel codice
     */
    function removeImagePngText() {
        // Cerca tutti i nodi di testo nel documento
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue.includes('image.png')) {
                // Sostituisci "image.png" con una stringa vuota
                node.nodeValue = node.nodeValue.replace('image.png', '');
            }
        }
    }
    
    /**
     * Inizializza il menu mobile con gli eventi di apertura e chiusura
     */
    function initMobileMenu() {
        const openMenu = document.getElementById('openMenu');
        const closeMenu = document.getElementById('closeMenu');
        const navLinks = document.getElementById('navLinks');

        if (!openMenu || !closeMenu || !navLinks) return;
        
        // Evento per aprire il menu
        openMenu.addEventListener('click', (e) => {
            e.stopPropagation(); // Previene che il click si propaghi al documento
            navLinks.style.right = '0';
        });

        // Evento per chiudere il menu
        closeMenu.addEventListener('click', () => {
            navLinks.style.right = '-300px';
        });
        
        // Chiudi il menu quando si clicca su un link (miglioramento UX)
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                // Chiudi il menu solo su dispositivi mobili
                if (window.innerWidth <= 768) {
                    navLinks.style.right = '-300px';
                }
            });
        });
        
        // Previeni che i click all'interno della navbar chiudano il menu
        navLinks.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Chiudi il menu quando si clicca fuori dalla navbar
        document.addEventListener('click', (e) => {
            // Verifica se il menu è aperto (visibile)
            if (navLinks.style.right === '0px' || navLinks.style.right === '0') {
                // Verifica che il click non sia sul pulsante di apertura
                if (e.target !== openMenu && !openMenu.contains(e.target)) {
                    navLinks.style.right = '-300px';
                }
            }
        });
    }
    
    /**
     * Inizializza le categorie del menu e genera le sezioni
     */
    function initMenuCategories() {
        const menuContainer = document.getElementById('menuContainer');
        const menuCategories = document.getElementById('menuCategories');
        const mobileCategories = document.getElementById('mobileCategories');
        const navLinks = document.getElementById('navLinks');

        if (!menuContainer) return;

        // Aggiungi il titolo principale "Menù" sopra le sezioni
        const menuTitle = document.createElement('h1');
        menuTitle.textContent = 'Menù';
        menuTitle.classList.add('menu-main-title');
        menuContainer.parentNode.insertBefore(menuTitle, menuContainer);
        

        // Genera i pulsanti delle categorie
        if (menuCategories || mobileCategories) {
            generateCategoryButtons(menuCategories, mobileCategories);
        }

        // Genera le sezioni del menu
        generateMenuSections(menuContainer);

        // Aggiungi eventi ai pulsanti delle categorie
        setupCategoryButtons(navLinks);

        // Aggiungi eventi alle intestazioni delle sezioni
        setupSectionHeaders();
        
        // Non apriamo più la prima sezione di default
        // per mantenere tutte le sezioni chiuse all'inizio
    }
    
    /**
     * Genera i pulsanti delle categorie per desktop e mobile
     */
    function generateCategoryButtons(menuCategories, mobileCategories) {
        // Ordina le chiavi del menu per mantenere un ordine coerente
        const orderedKeys = Object.keys(menuData);
        
        orderedKeys.forEach(key => {
            // Crea pulsante per desktop
            if (menuCategories) {
                const categoryBtn = createCategoryButton(key, menuData[key].title, 'category-btn');
                menuCategories.appendChild(categoryBtn);
            }
            
            // Crea pulsante per mobile
            if (mobileCategories) {
                const mobileCategoryBtn = createCategoryButton(key, menuData[key].title, 'category-btn', 'mobile-category-btn');
                mobileCategories.appendChild(mobileCategoryBtn);
            }
        });
    }
    
    /**
     * Crea un pulsante di categoria con le classi specificate
     */
    function createCategoryButton(key, title, ...classes) {
        const button = document.createElement('button');
        button.classList.add(...classes);
        button.textContent = title;
        button.setAttribute('data-category', key);
        return button;
    }
    
    /**
     * Genera le sezioni del menu
     */
    function generateMenuSections(menuContainer) {
        // Ordina le chiavi del menu per mantenere un ordine coerente
        const orderedKeys = Object.keys(menuData);
        
        orderedKeys.forEach(key => {
            const section = createMenuSection(key, menuData[key]);
            menuContainer.appendChild(section);
        });
    }
    
    /**
     * Configura gli eventi per i pulsanti delle categorie
     */
    function setupCategoryButtons(navLinks) {
        const allCategoryButtons = document.querySelectorAll('.category-btn');
        
        allCategoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                const section = document.getElementById(category);
                
                // Apri la sezione se è chiusa
                if (section && section.classList.contains('collapsed')) {
                    // Chiudi tutte le sezioni prima
                    closeAllSections();
                    
                    // Apri la sezione selezionata
                    openSection(section);
                }
                
                // Scorri alla sezione con animazione fluida
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                
                // Aggiorna il pulsante attivo
                allCategoryButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll(`[data-category="${category}"]`).forEach(btn => {
                    btn.classList.add('active');
                });
                
                // Chiudi il menu mobile
                if (navLinks && window.innerWidth <= 768) {
                    navLinks.style.right = '-300px';
                }
            });
        });

        // Imposta la prima categoria come attiva di default
        if (allCategoryButtons.length > 0) {
            const firstCategory = allCategoryButtons[0].getAttribute('data-category');
            document.querySelectorAll(`[data-category="${firstCategory}"]`).forEach(btn => {
                btn.classList.add('active');
            });
        }
    }
    
    /**
     * Chiude tutte le sezioni del menu
     */
    function closeAllSections() {
        document.querySelectorAll('.menu-section').forEach(section => {
            section.classList.add('collapsed');
            const icon = section.querySelector('.toggle-icon');
            if (icon) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    }
    
    /**
     * Apre una sezione specifica del menu
     */
    function openSection(section) {
        section.classList.remove('collapsed');
        const icon = section.querySelector('.toggle-icon');
        if (icon) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    }
    
    /**
     * Configura gli eventi per le intestazioni delle sezioni
     */
    function setupSectionHeaders() {
        const sectionHeaders = document.querySelectorAll('.menu-section-header');
        
        sectionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const section = this.parentElement;
                const isCollapsed = section.classList.contains('collapsed');
                
                // Chiudi tutte le sezioni
                closeAllSections();
                
                // Se la sezione era collassata, aprila
                if (isCollapsed) {
                    openSection(section);
                }
            });
        });
    }
    
    /**
     * Crea una sezione del menu
     */
    function createMenuSection(key, category) {
        const section = document.createElement('div');
        section.classList.add('menu-section', 'collapsed'); // Aggiungiamo 'collapsed' per iniziare con tutte le sezioni chiuse
        section.id = key;

        // Crea l'intestazione della sezione con l'icona toggle
        const header = document.createElement('div');
        header.classList.add('menu-section-header');
        
        const title = document.createElement('h2');
        title.textContent = category.title;
        
        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-chevron-down', 'toggle-icon'); // Cambiamo a fa-chevron-down per indicare che è chiuso
        
        header.appendChild(title);
        header.appendChild(icon);
        section.appendChild(header);

        // Crea il contenitore degli elementi
        const itemsContainer = document.createElement('div');
        itemsContainer.classList.add('menu-items');

        // Aggiungi gli elementi del menu
        if (category.items && Array.isArray(category.items)) {
            category.items.forEach((item, index) => {
                const menuItem = createMenuItem(item, index + 1); // Passiamo l'indice + 1 per numerare i piatti
                itemsContainer.appendChild(menuItem);
            });
        }

        section.appendChild(itemsContainer);
        return section;
    }
    
    /**
     * Crea un elemento del menu
     */
    function createMenuItem(item, number) {
        const menuItem = document.createElement('div');
        menuItem.classList.add('menu-item');

        const itemHeader = document.createElement('div');
        itemHeader.classList.add('item-header');

        const itemName = document.createElement('h3');
        // Aggiungiamo il numero del piatto prima del nome
        itemName.textContent = `${number}. ${item.name || ''}`;

        const itemPrice = document.createElement('div');
        itemPrice.classList.add('item-price');
        itemPrice.textContent = `€ ${item.price || ''}`;
        
        itemHeader.appendChild(itemName);
        itemHeader.appendChild(itemPrice);
        menuItem.appendChild(itemHeader);

        // Aggiungi la descrizione se presente
        if (item.description) {
            const itemDesc = document.createElement('p');
            itemDesc.classList.add('item-description');
            itemDesc.textContent = item.description;
            menuItem.appendChild(itemDesc);
        }

        return menuItem;
    }
    
    /**
     * Gestisce il caricamento lazy delle immagini
     * Miglioramento delle prestazioni
     */
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        // Verifica che l'attributo data-src esista prima di usarlo
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
});