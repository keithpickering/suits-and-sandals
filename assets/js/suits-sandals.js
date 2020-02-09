const Nav = {
    elems: {
        toggle: document.querySelector('#toggle-nav'),
        site: document.querySelector('#site'),
        nav: document.querySelector('#site-nav')
    },

    isOpen: false,

    toggle: function() {
        document.documentElement.classList.toggle('nav-open');
        this.isOpen = !this.isOpen;
    },

    open: function() {
        document.documentElement.classList.add('nav-open');
        this.isOpen = true;
    },

    close: function() {
        document.documentElement.classList.remove('nav-open');
        this.isOpen = false;
    },

    init: function() {
        this.elems.toggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });

        window.addEventListener('resize', (e) => {
            this.close();
        });

        this.elems.site.addEventListener('click', (e) => {
            if (this.isOpen) {
                this.close();
            }
        });

        window.addEventListener('scroll', () => {
            if (window.pageYOffset < 94) {
                this.elems.nav.classList.remove('c-site-nav--scrolled');
            } else {
                this.elems.nav.classList.add('c-site-nav--scrolled');
            }
        });
    }
}
Nav.init();


const PostFilters = {
    elems: {
        filters: null,
        clearFilters: null
    },

    shuffleInstance: null,

    init: function() {
        var Shuffle = window.Shuffle;
        var shuffleWrap = document.querySelector('.c-filter-posts');

        this.elems.filters = document.querySelectorAll('.js-filter');
        this.elems.clearFilters = document.querySelector('.js-clear-filters');

        this.shuffleInstance = new Shuffle(shuffleWrap, {
          itemSelector: '.c-card'
        });

        if (this.elems.filters && this.elems.clearFilters) {
            this.elems.filters.forEach((filter) => {
                filter.addEventListener('click', (e) => {
                    e.preventDefault();

                    this.elems.filters.forEach((filter) => {
                        filter.classList.remove('is-active');
                    });
                    filter.classList.add('is-active');

                    let cat = filter.getAttribute('data-category');
                    this.shuffleInstance.filter(cat);

                    // Show clear filters btn
                    this.elems.clearFilters.classList.add('is-visible');
                });
            });

            this.elems.clearFilters.addEventListener('click', (e) => {
                e.preventDefault();

                this.elems.filters.forEach((filter) => {
                    filter.classList.remove('is-active');
                });

                // Show all items
                this.shuffleInstance.filter();

                // Hide clear filters btn
                this.elems.clearFilters.classList.remove('is-visible');
            });
        }
    }
}
PostFilters.init();


const LazyLoadHandler = {
    lazyLoad: null,

    init: function() {
        this.lazyLoad = new LazyLoad({
            elements_selector: '.lazy'
        });
    }
}
LazyLoadHandler.init();


const Page = {
    elems: {
        loader: document.querySelector('#loader')
    },

    mountGlide: function() {
        const glide = new Glide('.glide', {
            type: 'slider',
            rewind: false,
            startAt: 2,
            perView: 5,
            focusAt: 'center',
            gap: 42,
            breakpoints: {
                1280: {
                    perView: 3
                },
                800: {
                    perView: 1
                }
            }
        });

        const glideTexts = document.querySelectorAll('.c-carousel__text');

        glide.on(['mount.after','run'], function() {
            const curr = glide._c.Html.slides[glide._i];
            const prev = curr.previousElementSibling;
            const next = curr.nextElementSibling;
            const all  = glide._c.Html.slides.concat(glide._c.Clones.items);
            all.forEach(function(slide) {
                slide.classList.remove('glide__slide--prev', 'glide__slide--next');
            });
            curr.classList.add('glide__slide--active');
            if (prev) prev.classList.add('glide__slide--prev');
            if (next) next.classList.add('glide__slide--next');

            glideTexts.forEach(function(text) {
                text.classList.remove('c-carousel__text--active');
            });

            setTimeout(function() {
                glideTexts[glide._i].classList.add('c-carousel__text--active');
            }, 350);
        });

        glide.mount();
    },

    mountPermalinks: function(article) {
        if (!article) return;
        var svgWrap = document.querySelector('#permalink-svg');
        if (!svgWrap) return;
        var icon = svgWrap.querySelector('svg').outerHTML;
        var headings = article.querySelectorAll('h2');
        for (var heading of headings) {
            var linkIcon = document.createElement('a');
            linkIcon.setAttribute('href', '#'+heading.id);
            linkIcon.innerHTML = icon;
            linkIcon.classList.add('c-permalink');
            heading.appendChild(linkIcon);
        }
    },

    init: function() {
        if (document.querySelector('.glide')) {
            this.mountGlide();
        }

        var article = document.querySelector('.c-article--single');
        if (article) {
            this.mountPermalinks(article);
        }

        const swup = new Swup({
            elements:          ['#page-main'],
            animationSelector: '[class*="u-transition-"]'
        });

        swup.on('animationOutStart', () => {
            // Hide mobile menu
            Nav.close();

            let newLoader = this.elems.loader.cloneNode(true);
            this.elems.loader.parentNode.replaceChild(newLoader, this.elems.loader);
            this.elems.loader = newLoader;
        });

        swup.on('contentReplaced', () => {
            let lazyImgs = document.querySelectorAll('.lazy');
            lazyImgs.forEach((el) => {
                el.classList.remove('loaded');
                el.classList.remove('initial');
                el.classList.remove('loading');
                el.setAttribute('data-was-processed', '');
            });
        });

        swup.on('animationInDone', () => {
            LazyLoadHandler.init();
            PostFilters.init();
            if (document.querySelector('.glide')) {
                this.mountGlide();
            }
            var article = document.querySelector('.c-article--single');
            if (article) {
                this.mountPermalinks(article);
            }
        });

        // Back button 
        swup.on('popState', () => {
            setTimeout(function() {
                let lazyImgs = document.querySelectorAll('.lazy');
                lazyImgs.forEach((el) => {
                    el.classList.add('loaded');
                });

                PostFilters.init();
                if (document.querySelector('.glide')) {
                    this.mountGlide();
                }
                var article = document.querySelector('.c-article--single');
                if (article) {
                    this.mountPermalinks(article);
                }
            }, 100);
        });

        window.addEventListener('load', () => {
            setTimeout(() => {
                document.documentElement.classList.remove('is-animating', 'is-preload');
            }, 500);
        });
    }
}
Page.init();