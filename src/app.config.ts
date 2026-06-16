export default defineAppConfig({
  pages: [
    'pages/tasks/index',
    'pages/verify/index',
    'pages/issues/index',
    'pages/profile/index',
    'pages/org-detail/index',
    'pages/verify-item/index',
    'pages/signature/index',
    'pages/summary/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#165DFF',
    navigationBarTitleText: '医疗机构实地核验',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#165DFF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/tasks/index',
        text: '任务'
      },
      {
        pagePath: 'pages/verify/index',
        text: '核验'
      },
      {
        pagePath: 'pages/issues/index',
        text: '问题'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
