import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import calendar from 'dayjs/plugin/calendar';
import relativeTime from 'dayjs/plugin/relativeTime';

// Dates are shown in Russian everywhere; `calendar` gives "today / yesterday"
// labels and `relativeTime` gives "5 minutes ago".
dayjs.extend(calendar);
dayjs.extend(relativeTime);
dayjs.locale('ru');

export default dayjs;
