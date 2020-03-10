import ImagePicker from 'react-native-image-picker';
import { requestCameraPermission,requestExternalPermission,requestExternalReadPermission } from './permissions';

export function pickImage(){
    requestCameraPermission();
    requestExternalPermission();
    requestExternalReadPermission();
    const options = {
        title: 'Select Avatar',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
    ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);
      
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = { uri: response.uri };
      
          // You can also display the image using data:
          // const source = { uri: 'data:image/jpeg;base64,' + response.data };
      
          return {
            avatarSource: source,
          }
        }
      });
}