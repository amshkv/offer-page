var relationId;
var reqId = 0;
var tourist_id = 0;
var type;

$.datetimepicker.setLocale('ru');

$(document).ready(function() {
  $(document).ajaxComplete(function(event, request, settings) {
    console.log(event, request, settings);

    $('.fancybox').fancybox({
      nextClick: true
    });
  });
});

$(document).ready(function() {
  type = reqId == 0 ? 1 : 2;

  // tenders($('.offer-page'), 'tenders', 0, relationId);
  offers($('.offer-page__wrapper'), 'offer_by_id', offerId, IMAGE_URL);

  // myChat = new chat($('#chat'), $('#chat_header'), CTRL_URL, relationId);
});

// ***********************************************
// снипеты
// ***********************************************

function offers($div, action, offerId, IMAGE_URL) {
  var offers;
  var images;

  function getOffers() {
    var objParams = {
      action: action,
      offerId: offerId
    };
    $.ajax({
      url: CTRL_URL,
      type: 'POST',
      data: objParams,
      dataType: 'json',
      success: function(data) {
        showOffers(data);
      }
    });
  }

  function showOffers(data) {
    var prevOfferId = 0;
    var prices = '';
    var commonCount = 0;
    var cnt_overdue = 0;
    var cnt_prices = 0;
    var dsp, btn;
    var favoriteColor;
    offers = data;

    if (!offers) {
      $('.breadcrumb').after(
        '<div class="offer-page__none">Предложения с номером ' +
          offerId +
          ' не существует.</div>'
      );
      return;
    }

    var count = 0;
    for (var i in offers) {
      count++;
    }

    for (var key in offers) {
      var offId = offers[key]['id'];
      var header = offers[key]['header'];
      var place = offers[key]['place'];
      var place_out = offers[key]['place_out'];
      var quantity_min = offers[key]['quantity_min'];
      var quantity_max = offers[key]['quantity_max'];
      var rest_begin = phpToCal(offers[key]['rest_begin']);
      var rest_end = phpToCal(offers[key]['rest_end']);
      var description = offers[key]['description'];
      var name = offers[key]['name'];
      var price = offers[key]['price'];
      var is_common = offers[key]['is_common'];
      var all_year = offers[key]['all_year'];
      var favorite_id = offers[key]['favorite_id'];
      var priceType = offers[key]['price_type'];
      var link = offers[key]['link'];
      var linktext = offers[key]['link_text'];
      var published = offers[key]['published'];
      var published_date = offers[key]['published_date'];

      var isPublished = 1;

      if (published == 0) {
        if (!published_date) {
          $('.breadcrumb').after(
            '<div class="offer-page__none">Предложения с номером ' +
              offerId +
              ' не существует.</div>'
          );
          return;
        } else {
          isPublished = 0;
        }
      }

      var headerPublished = '';

      if (!isPublished) {
        header += ' (снято с публикации)';
        headerPublished = 'offer-page__title--no-active';
      }

      if (prevOfferId !== offId) {
        favoriteColor = favorite_id > 0 ? 'heart' : 'like';

        // отправляем заголовок предложения в хлебные крошки
        $('.bredcrumb-page').text(header);

        var docTitle = 'Предложение на турпортале 8h.ru ' + header;

        document.title = docTitle;

        var placeAll;

        if (place) {
          placeAll = 'Из ' + place + ' в ' + place_out;
        } else {
          placeAll = 'В ' + place_out;
        }

        var priceTypeWrap = '';

        switch (priceType) {
          case 'tour':
            priceTypeWrap =
              '<span class="offer-page__price-type">Стоимость за тур:</span>';
            break;
          case 'period':
            priceTypeWrap =
              '<span class="offer-page__price-type">Стоимость за период:</span>';
            break;
          case 'day':
            priceTypeWrap =
              '<span class="offer-page__price-type">Стоимость за номер в сутки:</span>';
            break;
          case 'man':
            priceTypeWrap =
              '<span class="offer-page__price-type">Стоимость за человека:</span>';
            break;
          default:
            break;
        }

        var linksWrapper = '';

        if (isAuthorized && link) {
          if (linktext) {
            linksWrapper =
              '<a href="' +
              link +
              '" target="_blank" class="offer-page__link-more" title="' +
              linktext +
              '">' +
              linktext +
              '</a>';
          } else {
            linksWrapper =
              '<a href="' +
              link +
              '" target="_blank" class="offer-page__link-more" title="' +
              link +
              '">Подробнее</a>';
          }
        }

        var sliced = description.slice(0, 200);

        if (sliced.length < description.length) {
          sliced += '...';
        }

        var share =
          '<div class="share">' +
          '<button class="share__button" type="button"></button>' +
          '<div class="share__wrapper">' +
          '<div class="share__text">Поделиться</div>' +
          '<div class="ya-share2" data-services="vkontakte,facebook,gplus,whatsapp,odnoklassniki"' +
          'data-title="Предложение на турпортале 8h.ru ' +
          header +
          '" data-description="' +
          sliced +
          '">Поделиться</div>' +
          '</div>' +
          '</div>';

        var formatdescription = description.replace(
          /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
          '$1</p><p>$2'
        );

        var htmlOffer =
          '<div class="offer-page__line offer-page__line--image">' +
          '<div class="carousel slide carousel-generic" data-ride="carousel" id="imageOfferId_' +
          offId +
          '">' +
          // здесь фотографии
          '</div>' +
          '</div>' +
          '<div class="offer-page__line">' +
          '<h2 class="offer-page__title ' +
          headerPublished +
          '">' +
          header +
          '</h2>' +
          '<div class="offer-page__address">' +
          placeAll +
          ', ' +
          name +
          '</div>' +
          '<div class="offer-page__people">Количество от ' +
          quantity_min +
          ' до ' +
          quantity_max +
          '</div>' +
          '</div>' +
          '<div class="offer-page__line">' +
          '<div class="offer-page__user-text"><p>' +
          formatdescription +
          '</p></div>' +
          '</div>' +
          '<div class="offer-page__line offer-page__line--offers  offers" id="prices_' +
          offId +
          '">' +
          priceTypeWrap +
          // здесь список цен
          '</div>' +
          '<div class="offer-page__line offer-page__line--flex ">' +
          '<div class="offer-page__info-number">' +
          offId +
          '</div>';

        if (isPublished) {
          htmlOffer +=
            linksWrapper +
            share +
            '<a href="#" class="favorites ' +
            favoriteColor +
            '" data-offer-id="' +
            offId +
            '""></a>' +
            '<a href="#" class="offer-page__suggest relation" data-offer-id="' +
            offId +
            '" title="Связь с агентом">Связь с агентом</a>';
        }
        htmlOffer += '</div>';

        $div.append(htmlOffer);

        getImages(offId);

        if (prices !== '') {
          $('#prices_' + prevOfferId).append(prices);

          // if(commonCount > 0){
          //     $("#prices_" + prevOfferId).find(".clsHide").hide();
          // }

          prices = '';
        }
      }
      prevOfferId = offId;
      commonCount = 0;

      // var mathrand = Math.floor(Math.random() * 2);

      $('body').append(
        '<script src="https://yastatic.net/share2/share.js"></script>'
      );

      $('head').append(
        '<meta property="og:type" content="website"/>' +
          '<meta property="og:title" content="Предложение на турпортале 8h.ru ' +
          header +
          '"/>' +
          '<meta property="og:description" content="' +
          description +
          '">'
      );

      var mathrand = 0;

      var stockPrice = '';

      if (mathrand === 1) {
        stockPrice = '<span class="offer-stock">-%</span>';
      }

      prices +=
        '<div class="offers__item' +
        '">' +
        '<div class="offers__item-date">' +
        stockPrice +
        '<span class="offers__text-def">с </span>' +
        rest_begin +
        '<span class="offers__text-def"> по </span>' +
        rest_end +
        '</div>' +
        '<div class="offers__item-price">' +
        '<span class="offers__text-def">Стоимость: </span>' +
        price +
        ' руб.</p>' +
        '</div>' +
        '</div >';
      commonCount++;

      if (all_year == 1) {
        prices =
          '<div class="offers__item">Круглый год цена: ' +
          price +
          ' руб.</div>';
        commonCount++;
        $('#prices_' + prevOfferId).append(prices);
        return;
      }

      if (key == count - 1) {
        $('#prices_' + prevOfferId).append(prices);
      }
    }
  }

  function relateOffer(offerId) {
    var $form = $('<form>', {
      action: CTRL_URL,
      method: 'POST'
    })
      .append(
        $('<input>', {
          type: 'hidden',
          name: 'action',
          value: 'relate_offer'
        })
      )
      .append(
        $('<input>', {
          type: 'hidden',
          name: 'offerId',
          value: offerId
        })
      );

    $('body').append($form);
    $form.submit();
  }

  function changeFavorites($elem) {
    var offerId = $elem.data('offerId');
    var objParams = {
      action: 'favorites_change',
      offerId: offerId
    };

    $.ajax({
      url: CTRL_URL,
      type: 'POST',
      data: objParams,
      dataType: 'json',
      success: function(data) {
        btnFavorites($elem, data[0][0]);
      }
    });
  }
  function btnFavorites($elem, id) {
    if (id == 0) {
      $elem.removeClass('heart').addClass('like');
    } else {
      $elem.removeClass('like').addClass('heart');
    }
  }

  function getImages(offerId) {
    var objParams = {
      action: 'offer_images',
      offerId: offerId
    };
    $.ajax({
      url: CTRL_URL,
      type: 'POST',
      data: objParams,
      dataType: 'json',
      success: function(data) {
        showImages(data);
      }
    });
  }

  function showRegistrationPage(params) {
    if (
      confirm(
        'Чтобы связаться с отелем или турагентом, необходимо зарегистрироваться. Перейти на страницу регистрации?'
      )
    ) {
      document.location.href = '/';
    } else {
      return false;
    }
  }

  function showImages(data) {
    images = data;

    if (images === null) {
      $('.offer-page__line--image').remove();
      return;
    }

    var offId = images[0]['offer_id'];

    var act = 0;
    var count = Object.keys(images).length;

    var htmlImages = '<div class="carousel-inner" id="carousel_' + offId + '">';

    var dataImageNew = '';

    for (var key in images) {
      var imageId = images[key]['id'];
      var name = images[key]['name'];
      var offerId = images[key]['offer_id'];
      var clearPath = images[key]['image'];
      var thumbnailPath = images[key]['thumbnail'];
      var avatar = images[key]['avatar'];
      var active = '';

      if (avatar === imageId) {
        active = 'active';
        act += 1;
      }

      if (key == count - 1 && act == 0) {
        active = 'active';
      }

      htmlImages +=
        '<a class="item fancybox ' +
        active +
        '" rel="fancybox' +
        offerId +
        '" href="' +
        IMAGE_URL +
        clearPath +
        '">' +
        '<img  src="' +
        IMAGE_URL +
        thumbnailPath +
        '" alt="' +
        name +
        '">' +
        '</a>';

      dataImageNew +=
        '<meta property="og:image" content="' +
        IMAGE_URL +
        thumbnailPath +
        '" />';
    }

    htmlImages += '</div>';

    if (count > 1) {
      // '<a class="carousel-control-prev" href="#carousel_'+ offId +'" role="button" data-slide="prev">' +
      htmlImages +=
        '<a class="left carousel-control" href="#imageOfferId_' +
        offId +
        '" data-slide="prev"></a>' +
        '<a class="right carousel-control" href="#imageOfferId_' +
        offId +
        '" data-slide="next"></a>';
    }

    $('#imageOfferId_' + offerId).html(htmlImages);

    $('head').append(dataImageNew);

    $('.ya-share2').attr('data-image', IMAGE_URL + thumbnailPath);
  }
  getOffers();

  $('html').on('click', '.share__button', function() {
    var $div = $('+ .share__wrapper', this);
    if ($div.is(':visible')) {
      $div.fadeOut(300, function() {
        $div.removeClass('active');
      });
    } else {
      $div
        .addClass('active')
        .hide()
        .fadeIn(300);
    }
  });

  $('html').on('click', '.relation', function() {
    event.preventDefault();
    if (username == '' || username == null) {
      showRegistrationPage();
      return;
    }
    relateOffer($(this).data('offerId'));
  });

  $('html').on('click', '.favorites', function() {
    event.preventDefault();
    if (username == '' || username == null) {
      showRegistrationPage();
      return;
    }

    changeFavorites($(this));
  });
}
