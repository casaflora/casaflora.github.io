(function (orionWindow) {

    let $ = jQuery;

    // Verificando se ele já foi declarado anteriormente
	if(typeof $.OrionStoreFrontLazyLoad === "function") {
        console.log("[OrionStoreFrontLazyLoad] - Já foi iniciado.");
        return;
    }

    // Opções
    let defaults = {
        rangeThrottle: 50
    }

    let regex = /-([0-9]+\-[0-9]+)/g;

    // Núcleo
    let OrionStoreFrontLazyLoad = function(elem, options){
        options = $.extend(true, {}, defaults);
        let pubRangeThrottle = options.rangeThrottle;
        
        if (!elem.length) {
            console.warn("Nenhum box-banner encontrado.");
            return;
        }

        let $thisElement = $(elem);

        $thisElement.each(function() {
            let $t = $(this);
            if ($t.is(".ow-sfll-loaded")) {
                return;
            }

            if (isInViewport($t)) {
                let $thisNS = $t.find("noscript");
                let thisContent = $($thisNS.text());
                let thisSrc = thisContent.attr("src");
                thisSrc = thisSrc.replace(regex, "-240-240");
                // newImage = thisContent[0].attr("src", thisSrc);
                console.log($(thisContent[0]).attr("src", thisSrc));
                $t.html(thisContent[0]);
                $t.addClass("ow-sfll-loaded");
            } 
        });

        initThrottleScroll();
        $(window).on("OW.sfll-scroll", function () {
            $thisElement.each(function() {
                let $t = $(this);
                if ($t.is(".ow-sfll-loaded")) {
                    return;
                }

                if (isInViewport($t)) {
                    let $thisNS = $t.find("noscript");
                    let thisContent = $($thisNS.text());
                    $t.html(thisContent[0]);
                    $t.addClass("ow-sfll-loaded");
                } 
            });
        });

        // Verificador (se a imagem está na tela)
        function isInViewport(el) {
            let rect = el[0].getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        // Configuração do Throttle scroll
        function initThrottleScroll() {
            let scrolling;
            $(document).on("scroll",function(){
                scrolling = true;
            });
            setInterval(function(){
                if(scrolling){
                    scrolling = false;
                    $(window).trigger("OW.sfll-scroll", []);
                }
            }, pubRangeThrottle);
        }

    }

    // Adicionando o plugin ao jQuery
	$.fn.OrionStoreFrontLazyLoad = function(opts){
		var $this = $(this);
		$this.orionPlugin = new OrionStoreFrontLazyLoad($this, $.extend({}, defaults));
		$(window).trigger("OW.sfll-ready");
		return $this;
	};

})(this);