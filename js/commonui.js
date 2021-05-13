(function ($) {
    const checkMobile = (function () {
        const varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기

        if (varUA.indexOf('android') > -1) {
            //안드로이드
            return 'android';
        } else if (varUA.indexOf('iphone') > -1 || varUA.indexOf('ipad') > -1 || varUA.indexOf('ipod') > -1) {
            //IOS
            return 'ios';
        } else {
            //아이폰, 안드로이드 외
            return 'other';
        }
    })();

    function checkVideoFe(src) {
        const arr = src.split('?')[0].split('.');
        return arr[arr.length - 1];
    }

    function initVdoSlider() {
        var $slider = $('.vdo-slider-wrap'); // vdo-slider-wrap
        var $sliderInn = $slider.find('.vdo-slider'); // vdo-slider
        var $contentWrap = $slider.closest('.section-06'); // section-06
        var timer = null;
        var $video = $slider.find('video');

        function getSnum() {
            return Number($slider.attr('snum'));
        }

        function moveTo(n) {
            $slider.attr('snum', n);
        }

        function autoplay() {
            var aft = getSnum() + 1;
            if (aft == 7) aft = 1;

            moveTo(aft);

            clearTimeout(timer);
            timer = setTimeout(autoplay, 3000);
        }

        $video.each(function () {
            var video = this;
            var videoSrc = this.src;
            var fe = checkVideoFe(this.src);
            var $wrap = $(this).parent();

            if (fe == 'm3u8') {
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = videoSrc + "?playsinline=1";
                    video.setAttribute('playsinline', true);
                } else if (Hls.isSupported()) {
                    const hls = new Hls();
                    hls.loadSource(videoSrc);
                    hls.attachMedia(video);

                    hls.on(Hls.Events.ERROR, function (event, data) {
                        var errorType = data.type;
                        var errorDetails = data.details;
                        var errorFatal = data.fatal;

                        hls.destroy();
                    });
                }
            } else {
                video.setAttribute('playsinline', true);
                video.src = videoSrc;
            }

            video.onended = function () {
                video.currentTime = 0;
                $wrap.removeClass('is-playing').removeClass('is-pause');
                $contentWrap.removeClass('dimmed');
                timer = setTimeout(autoplay, 3000);
            };

            $(this).siblings('.btn-close').on('click', function () {
                video.pause();
                video.onended();
            });

            $(video).on('click', function () {
                if ($wrap.hasClass('is-playing')) {
                    if ($wrap.hasClass('is-pause')) {
                        video.play();
                        $wrap.removeClass('is-pause');
                    } else {
                        video.pause();
                        $wrap.addClass('is-pause');
                    }
                }
            });

            $(this).siblings('.btn-play').on('click', function () {
                if ($wrap.hasClass('is-playing')) {
                    if ($wrap.hasClass('is-pause')) {
                        video.play();
                        $wrap.removeClass('is-pause');
                    } else {
                        video.pause();
                        $wrap.addClass('is-pause');
                    }
                } else {
                    $wrap.addClass('is-playing');
                    $contentWrap.addClass('dimmed');
                    clearTimeout(timer);
                    video.play();
                }
            });
        });


        var _moveToLeft = function () {
            var aft = getSnum() - 1;
            if (aft == 0) aft = 6;

            moveTo(aft);

            clearTimeout(timer);
            timer = setTimeout(autoplay, 3000);
        };

        var _moveToRight = function () {
            var aft = getSnum() + 1;
            if (aft == 7) aft = 1;

            moveTo(aft);

            clearTimeout(timer);
            timer = setTimeout(autoplay, 3000);
        };

        var touchstartY = 0
            , touchstartX = 0
            , touchendX = 0
            , touchendY = 0
            , touchoffsetX = 0
            , touchoffsetY = 0;

        $sliderInn.on('touchstart', function (e) {
            var touch = e.touches[0];
            touchstartX = touch.clientX;
            touchstartY = touch.clientY;
        });

        $sliderInn.on('touchend', function (e) {
            if (e.touches.length == 0) {
                var touch = e.changedTouches[e.changedTouches.length - 1];
                touchendX = touch.clientX;
                touchendY = touch.clientY;

                touchoffsetX = touchendX - touchstartX;
                touchoffsetY = touchendY - touchstartY;

                if (Math.abs(touchoffsetX) >= 80 && Math.abs(touchoffsetY) <= 30) {
                    if($contentWrap.hasClass('dimmed')) return;

                    if (touchoffsetX < 0) {
                        // swipe left
                        _moveToRight();
                    }
                    else {
                        // swipe right
                        _moveToLeft();
                    }
                }
            }
        });

        timer = setTimeout(autoplay, 3000);
    }

    // 팝업 활성화 / 비활성화
    function popControl() {
        $('[data-open]').on('click', function (e) {
            e.preventDefault();
            var data = $(this).data('open');
            $("[data-openpop='" + data + "']").removeClass('out').addClass('active');
        })

        $('.layer-close').on('click', function () {
            $(this).closest('.layer-pop').removeClass('active').addClass('out');
            $('body').removeClass('non-scroll');
        })
    }

    function bArrow(){
        $(window).on('scroll', function(){
            var $Top = $(document).scrollTop();
            var $bodyH = $('body').height();
            //var $footerIn = $('footer').height();
            var $footerH = $('footer').outerHeight();
            var $windowH = $(window).height();
            var fix = ($bodyH - $footerH) - $windowH;
            if ($Top > fix)
            {
                ///bottom = (($footerH / 10) + 2) + 'rem';
                $('.b-arrow').addClass('fix');
                ///$('.b-arrow').css('bottom', bottom);
            } else {
                //$('.b-arrow').removeClass('fix').removeAttr('style');
                $('.b-arrow').removeClass('fix');
            }
        });
    }

    function sectionHeight(){
        var $section01 = $('.section-01');
        var $headerH = $('header').outerHeight();
        var $winH = $(window).height();
        height = ($winH - $headerH) / 10 + 'rem';
        $section01.css('height',height);
    }

    // ready
    $(function () {

        sectionHeight();

        // swiper-01
        $('.swiper-01').slick({
            dots: true,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 2000,
        });

        // swiper-02
        $('.swiper-02').slick({
            dots: false,
            arrows: false,
            centerMode: true,
            slidesToShow: 1,
            centerPadding: '6rem'
        });

        // 맞춤형 건강 정보
        initVdoSlider();

        // scroll script
        var $WIN = $(window);

        var $scTrigger = $('.section-02 .ico-list, .section-03 .img-box, .section-04 .visual-wrap, .section-05 .txt-box-wrap');
        var $header = $('.header');
        var hdh = $header.outerHeight();
        var wh = $WIN.height();

        $WIN.on('resize', function () {
            hdh = $header.outerHeight();
            wh = $WIN.height();
        });

        $WIN.on('scroll', function (e) {
            var sct = $WIN.scrollTop();
            var scl = sct + wh;

            sct += hdh;

            $scTrigger.each(function () {
                var $this = $(this);
                var oft = $this.offset().top;
                var otl = oft + $this.outerHeight();

                if (!$this.hasClass('animate') &&
                    (sct <= oft && oft <= scl
                        || sct <= otl && otl <= scl
                        || sct >= oft && otl >= scl)
                ) {
                    $this.addClass('animate');
                    if($this.hasClass('visual-wrap')) {
                        // 건강 365
                        var triggerMotion01 = function(){
                            $this.removeClass('animate');
                            setTimeout(function() {
                                $this.addClass('animate');
                                setTimeout(triggerMotion01,7300);
                            },1500);
                        };

                        setTimeout(triggerMotion01,7300);
                    } else if($this.hasClass('txt-box-wrap')) {
                        // 건강 365
                        var triggerMotion02 = function(){
                            $this.removeClass('animate');
                            setTimeout(function() {
                                $this.addClass('animate');
                                setTimeout(triggerMotion02,9500);
                            },1500);
                        };

                        setTimeout(triggerMotion02,9500);
                    }
                    $this.trigger('startAnimate');
                }
            });
        });

        // 초기 위치 스크롤 이벤트 트리거
        $WIN.trigger('scroll');

        // 팝업 활성화 / 비활성화
        popControl();

        bArrow();

        // 210513 검색 결과 없음
        var win_h = $(window).height();
        var board_head_h = $('.board-head').innerHeight();
        var board_cont_h = $('.board-cont').innerHeight();
        var noTitle_except_h = $('.srch-box').outerHeight(true) + $('.btn-area').outerHeight(true);
        var noTitle_h_new  = win_h - board_head_h - noTitle_except_h - 100; // 100 = board-cont의 padding + tbl-list의 padding

        //console.log("전체높이 :" + win_h, "/ 헤더높이 :" + board_head_h, "/ 컨텐츠높이 :" + board_cont_h, "/ 글없음 제외한 높이 :" + noTitle_except_h, "/ 적용값 :" + noTitle_h_new);

        var noTitle = $('.tbl-list .tbl-body.no-title');
        if(noTitle.length != 0){
            noTitle.height(noTitle_h_new);
        }

    });
})(jQuery);