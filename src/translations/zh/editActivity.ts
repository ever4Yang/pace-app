import { ACTIVITY_TITLE_MAX_LENGTH, ACTIVITY_TITLE_MIN_LENGTH } from '../../consts';

export default {
  screenTitle: '编辑活动',
  form: {
    nameTooShort: `名称至少需要 ${ACTIVITY_TITLE_MIN_LENGTH} 个字符`,
    nameTooLong: `名称最多 ${ACTIVITY_TITLE_MAX_LENGTH} 个字符`,
    nameMissing: '请输入活动名称',
    activityTypeMissing: '请选择活动类型',
  },
  savingModal: {
    title: '正在保存…',
    errorBody: '保存活动时发生错误。',
    buttons: { retry: '重试', cancel: '取消' },
  },
};
