/**
 * Ant Design theme: the site's colours, radii and type sizes as design
 * tokens. The same values for the site's own styles are in
 * styles/variables.scss; keep the two in step.
 */
const FONT =
  "'Futura PT Book', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const theme = {
  token: {
    colorPrimary: '#1890ff',
    colorLink: '#1890ff',
    colorInfo: '#1890ff',
    borderRadius: 4,
    fontFamily: FONT,
    fontSize: 16,
    fontSizeSM: 12,
    fontSizeLG: 18,
    colorBorder: '#d9d9d9',
  },
  components: {
    Form: { labelColor: '#5e6674' },
    Layout: { bodyBg: '#f0f2f5', headerBg: '#fff' },
  },
};

export default theme;
