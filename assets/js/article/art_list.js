$(function(){
    var layer=layui.layer;
    var laypage=layui.laypage;
    var form=layui.form;
    // 定义一下查询的参数对象，将来请求的数据的时候
    // 需要将请求参数的对象提交到服务器
    var layout=['count','limit' ,'prev', 'page', 'next','skip'] 
    var q={
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 1, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '', // 文章的发布状态  
    }
    intiTable()
    function intiTable(){
        $.ajax({
            method: 'GET',
            url:'/my/article/list',
            data:q,
            success:function(res){
             if(res.status!==0){
                 return layer.msg('获取文章列表失败')
             }
             var htmlStr = template('tpl-table', res)
             $('tbody').html(htmlStr)
            }
        })
    }
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
    
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
    
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
    
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
      }
    
      // 定义补零的函数
      function padZero(n) {
        return n > 9 ? n : '0' + n
      }
      initCate()

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 通过 layui 重新渲染表单区域的UI结构
        form.render()
      }
    })
  }
  $('#form-search').on('submit', function(e) {
    e.preventDefault()
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件，重新渲染表格的数据
    intiTable()
    initCate()
})
function renderPage(total) {
    console.log(total)
}
initTable()
function initTable() {
    $.ajax({
          method: 'GET',
          url: '/my/article/list',
          data: q,
          success: function(res) {
                if (res.status !== 0) {
                     return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
          }
    })
}
function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox', // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum,
      layout:layout, // 设置默认被选中的分页
      limits:[1,2,3,5,10],
    //   触发条件一：点击页码
    //   触发条件二：掉调用renderPage这个函数就会触发。
      jump: function(obj, first) {
        console.log(obj.curr)
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr
        q.pagesize=obj.limit
        // 根据最新的q来渲染
        if(!first){
            //do something
            initTable()
          }
        
      }
    })
}
$('tbody').on('click','.btn-delete',function(){
  var id = $(this).attr('data-id')
  var len=$('.btn-delete').length;
    // 提示用户是否要删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败！')
          }
          layer.msg('删除分类成功！')
         if(len===1){
            q.pagenum=q.pagenum==1 ? 1 : p.pagenum-1;
         }
          initArtCateList()
        }
      })
       layer.close(index)
      })
})

})