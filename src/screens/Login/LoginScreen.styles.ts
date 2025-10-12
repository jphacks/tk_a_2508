import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // LinearGradientを使用するためbackgroundColorは不要
  },
  logoArea: {
    position: 'absolute',
    top: height * 0.15, // より上部に配置
    left: width * 0.1, // 中央寄せ
    width: width * 0.8, // より幅広く
    height: height * 0.25, // より高く
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: width * 0.7, // ロゴの幅を画面幅の70%に設定
    height: height * 0.2, // ロゴの高さを画面高さの20%に設定
    maxWidth: 400, // 最大幅を制限
    maxHeight: 200, // 最大高さを制限
  },
  formArea: {
    position: 'absolute',
    top: height * 0.45, // より下に配置
    left: width * 0.1, // 中央寄せ
    width: width * 0.8, // より幅広く
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: height * 0.02, // より適切な間隔
    width: '100%',
  },
  input: {
    width: '100%',
    height: height * 0.06, // より適切な高さ
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: '400',
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  loginButton: {
    width: '100%',
    height: height * 0.06, // より適切な高さ
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#3786EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.03, // より適切な間隔
  },
  loginButtonText: {
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: '700',
    color: '#3191F2',
  },
});
