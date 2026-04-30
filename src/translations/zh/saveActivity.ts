import { ACTIVITY_TITLE_MAX_LENGTH, ACTIVITY_TITLE_MIN_LENGTH } from '../../consts';

export default {
  screenTitle: '保存活动',
  mapNotAvailable: '地图不可用',
  saving: '正在保存活动',
  form: {
    namePlaceholder: '活动名称',
    nameTooShort: `名称至少需要 ${ACTIVITY_TITLE_MIN_LENGTH} 个字符`,
    nameTooLong: `名称最多 ${ACTIVITY_TITLE_MAX_LENGTH} 个字符`,
    nameMissing: '请输入活动名称',
    saveButtonLabel: '保存',
    errorSaving: '保存失败',
    defaultName: {
      morning: '早晨{{activityType}}',
      afternoon: '下午{{activityType}}',
      evening: '晚间{{activityType}}',
    },
    activityType: { running: '跑步', cycling: '骑行' },
    activityTypeMissing: '请选择活动类型',
  },
  errors: {
    failureMessage: '保存活动失败',
    retry: '重试',
    cancel: '放弃活动',
  },
  discardModal: {
    title: '放弃此活动？',
    body: '此操作无法撤销。',
    buttons: { stayHere: '继续', discard: '放弃' },
  },
};
