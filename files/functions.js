const CTRL_URL = 'controller.php';
const IMAGE_URL = 'https://h.8h.ru/';
var TENDER_URL = 'https://t.8h.ru';
var HOTEL_URL = 'https://h.8h.ru/';

function sendData(objParams) {
  $.ajax({
    url: CTRL_URL,
    type: 'POST',
    data: objParams,
    dataType: 'json',
    success: function(data) {
      //alert(data[0][0]);
    }
  });
}
