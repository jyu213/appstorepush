/**
 * 搜索页面
 */
let search = {
  init() {
    this.bindEvents();
  },
  bindEvents() {
    $('body').on('click', '.J-sub-btn', this.subForm.bind(this))
            .on('click', '.J-pager', this.loadPager.bind(this));
  },
  /**
   * 搜索提交表单
   */
  subForm(e) {
    this.postData(1);
  },
  /**
   * 翻页
   */
  loadPager(e) {
    let et = $(e.currentTarget),
        idx = et.data('idx') * 1,
        total = et.data('total') * 1;

    if (idx >= total) {
      return false;
    }

    this.postData(idx+1);
  },
  postData(idx = 1) {
    let _self = this;

    let term = $('.J-sub-ipt').val(),
        country = $('.J-sub-country').val();
    let el = $('.J-result-list');

    if (term !== '' && country !== '') {
      $.ajax({
          url: '/search',
          data: {
            term: term,
            country: country,
            page: idx
          }
      }).done((data) => {
        if (data.success) {
          let items = data.items,
              pager = data.pager,
              html = _self.listTpl(items);
          // console.log(data.items);
          el.html(html);
          $('#pager').html( _self.listPager(pager.currentPage, pager.totalPage));
        } else {
          el.html('');
          el.find('#pager').html('');
          console.log(data.message);
        }
      });
    } else {
      alert('不能为空');
    }
  },
  listTpl(data) {
    let html = '',
        tpl = (item) => `<div class="media">
                          <div class="media-left">
                            <img class="media-object" src="${item.artworkUrl100}" />
                          </div>
                          <div class="media-body">
                            <a class="media-heading" href="${item.trackViewUrl}">${item.trackName}</a>
                            <p> 设备支持：${item.supportedDevices}</p>
                            <p> ID：${item.artistId}</p>
                            <p> 版本：${item.version}</p>
                            <pre style="display: none;">${item.description}</pre>
                          </div>`;

    data.forEach((item) => {
      html += tpl(item);
    });
    return html;
  },
  listPager(idx, total) {
    let pager = `<li><a href="javascript:;" class="J-pager" data-idx="${idx}" data-total="${total}">上一页</a></li>
                  <li class="active"><a>${idx}/${total}</a></li>
                  <li><a href="javascript:;" class="J-pager" data-idx="${idx}" data-total="${total}">下一页</a></li>`;

    return pager;
  }
};

search.init();
