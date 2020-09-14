$(function(){
  var indexAdd=null;
  var indexEdit=null;
  var form=layui.form;
    initArtCateList()
    function initArtCateList(){
 $.ajax({
     method:'get',
     url: '/my/article/cates',
      success: function(res) {
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
 })
}
$('#btnAddCaate').on('click',function(){
  indexAdd=layer.open({
    type: 1,
    area: ['500px', '250px'],
    title: '添加文章分类',
    content: $('#dialog-add').html()
  })    
})
// 通过代理的方式为form绑定点击事件
$('body').on('submit','#form-add',function(e){
   e.preventDefault()
   $.ajax({
    method: 'POST',
    url: '/my/article/addcates',
    data:$(this).serialize(),
    success:function(res){
      if (res.status !== 0) {
        return layer.msg('新增分类失败！')
      }
      initArtCateList()
      layer.msg('新增分类成功！')

      // 根据索引，关闭对应的弹出层
      console.log(indexAdd);
      layer.close(indexAdd)
     }
   })
})
// 透过代理为编辑按钮绑定点击事件
$('tbody').on('click','#btn-edit',function(){
// 弹出一个编辑表单的代码
indexEdit=layer.open({
  type: 1,
  area: ['500px', '250px'],
  title: '添加文章分类',
  content: $('#dialog-edit').html() 
})  
var id=$(this).attr('data-id')
console.log(id);
$.ajax({
  method: 'GET',
  url: '/my/article/cates/' + id,
  success: function(res) {
    form.val('form-edit', res.data)
  }
})
})
$('body').on('submit','#form-edit',function(e){
  e.preventDefault()
  $.ajax({
    method: 'POST',
    url: '/my/article/updatecate',
    data: $(this).serialize(),
    success: function(res) {
      if (res.status !== 0) {
        return layer.msg('更新分类数据失败！')
      }
      layer.msg('更新分类数据成功！')
      initArtCateList()
      layer.close(indexEdit)
      
    }
})
})
// 给删除按钮绑定点击事件
$('tbody').on('click','.btn-delete',function(){
  var id=$(this).attr('data-id')
  layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index){
    $.ajax({
      method: 'GET',
      url: '/my/article/deletecate/' + id,
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('删除分类失败！')
        }
        layer.msg('删除分类成功！')
        layer.close(index)
        initArtCateList()
      }
    })
  })
})

})