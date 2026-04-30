export default {
  screenTitle: '设置',
  version: '版本 {{version}}',
  saving: '正在保存…',
  chooseProfilePicture: {
    screenTitle: '头像',
    edit: '编辑',
    bottomSheet: {
      camera: '拍照',
      photo: '从相册选择',
      delete: '删除照片',
    },
    updateSavingModal: {
      title: '正在保存您的头像…',
      error: '保存头像时发生错误。',
      buttons: {
        retry: '重试',
        discard: '放弃',
      },
    },
    deleteSavingModal: {
      title: '正在删除您的头像…',
      error: '删除头像时发生错误。',
      buttons: {
        retry: '重试',
        discard: '放弃',
      },
    },
    alert: {
      cameraPermissions: {
        title: '"PACE" 无法访问相机。',
        body: '可在设置中配置相机权限',
      },
      photoPermissions: {
        title: '"PACE" 无法访问相册。',
        body: '可在设置中配置相册权限。',
      },
      buttons: {
        openSettings: '打开设置',
        cancel: '取消',
      },
    },
    discardModal: {
      title: '放弃对头像的更改？',
      buttons: {
        stayHere: '继续',
        discard: '放弃更改',
      },
    },
    errors: {
      openCameraFailure: '无法打开相机。',
      openPhotosFailure: '无法打开相册。',
    },
  },
  changeDefaultActivityType: {
    screenTitle: '默认活动类型',
    inputs: {
      activityType: {
        invalid: '无效的活动类型',
        error: '活动类型为必填项',
      },
    },
  },
  changeDisplayPreferences: {
    screenTitle: '显示偏好',
    inputs: {
      systemOfMeasurement: {
        label: '计量单位制',
        invalid: '无效的计量单位制',
        error: '计量单位制为必填项',
      },
    },
    units: {
      label: '单位',
      metric: '公制',
      imperial: '英制',
    },
    discardModal: {
      title: '放弃对显示偏好的更改？',
      buttons: {
        stayHere: '继续',
        discard: '放弃更改',
      },
    },
    savingModal: {
      title: '正在保存您的显示偏好…',
      error: '保存显示偏好时发生错误。',
      buttons: {
        retry: '重试',
        discard: '放弃',
      },
    },
  },
  configureHealthInformation: {
    screenTitle: '健康信息',
    notConfigured: '未配置',
    yearsOld: '岁',
    saving: '正在保存您的健康信息…',
    ok: '确定',
    inputs: {
      gender: {
        label: '性别',
        male: '男',
        female: '女',
        'non-binary': '非二元',
        error: '性别为必填项',
        invalid: '性别无效',
      },
      birthDate: {
        label: '出生日期',
        error: '出生日期为必填项',
      },
      weight: {
        label: '体重 ({{unit}})',
        placeholder: '体重 ({{unit}})',
        error: '体重为必填项',
        invalid: '体重必须是大于 0 的数字',
      },
    },
    errors: {
      failureMessage: '保存健康信息时发生错误。',
      retry: '重试',
      discard: '放弃',
    },
  },
  defaultActivityType: {
    screenTitle: '默认活动类型',
    activityTypes: {
      running: '跑步',
      cycling: '骑行',
    },
    savingModal: {
      title: '正在保存默认活动类型…',
      error: '保存默认活动类型时发生错误。',
      buttons: {
        retry: '重试',
        discard: '放弃',
      },
    },
  },
  buttons: {
    displayPreferences: '显示偏好',
    healthInformation: '健康信息',
    defaultActivityType: '默认活动类型',
    language: '语言',
  },
};
