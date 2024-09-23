import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
  BackHandler,
  TextInput,
} from 'react-native';

import Dialog from 'react-native-dialog';

import {
  Dialog as GalleryDialog,
  ProgressDialog,
} from 'react-native-simple-dialogs';
import { AntDesign, Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import FileitemCategorie from '../components/components/Browser/Files/FileItemCategorie';
import Pickimages from '../components/components/Browser/PickImages';
import ActionSheet from '../components/components/ActionSheet';

import useSelectionChange from '../components/hooks/useSelectionChange';
import allProgress from '../components/utils/promiseProgress';

import { NewCategorieDialog } from '../components/components/Browser/NewCategorieDialog';
import { DownloadDialog } from '../components/components/Browser/DownloadDialog';
import { CategoryTransferDialog } from '../components/components/Browser/CategoryTransferDialog';

import axios, { AxiosError } from 'axios';
import moment from 'moment';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';
import * as mime from 'react-native-mime-types';

import { StackScreenProps } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { ExtendedAsset, fileItemCategorie } from '../components/utils/types';
import { useAppDispatch, useAppSelector } from '../components/hooks/reduxHooks';
import { setImages } from '../components/files/imagesSlice';
import { setSnack, snackActionPayload } from '../components/files/snackbarSlice';
import { HEIGHT, imageFormats, reExt, SIZE } from '../components/utils/Constants';
import ChatBox from './Chatbox';
import ChatPage from './ChatPage';

type CategorieParamList = {
  Categorie: { prevDir: string; categorieName: string };
};

type ICategorieProps = StackScreenProps<CategorieParamList, 'Categorie'>;

const Categorie = ({ route }: ICategorieProps) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { colors } = useAppSelector((state) => state.theme.theme);
  const docDir: string = FileSystem.documentDirectory || '';
  const [currentDir, setCurrentDir] = useState<string>(
    route?.params?.prevDir !== undefined ? route?.params?.prevDir : docDir
  );
  const [moveDir, setMoveDir] = useState('');
  const [files, setFiles] = useState<fileItemCategorie[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<fileItemCategorie[]>([]);
  const [categorieDialogVisible, setCategorieDialogVisible] = useState(false);
  const [downloadDialogVisible, setDownloadDialogVisible] = useState(false);
  const [renameDialogVisible, setRenameDialogVisible] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [renamingFile, setRenamingFile] = useState<fileItemCategorie>();
  const renameInputRef = useRef<TextInput>(null);
  const [multiImageVisible, setMultiImageVisible] = useState(false);
  const [importProgressVisible, setImportProgressVisible] = useState(false);
  const [destinationDialogVisible, setDestinationDialogVisible] =
    useState(false);
  const [newFileActionSheet, setNewFileActionSheet] = useState(false);
  const [moveOrCopy, setMoveOrCopy] = useState('');
  const { multiSelect, allSelected } = useSelectionChange(files);

  useEffect(() => {
    getCategories();
  }, [currentDir]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCategories();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route?.params?.categorieName !== undefined) {
      setCurrentDir((prev) =>
        prev?.endsWith('/')
          ? prev + route.params.categorieName
          : prev + '/' + route.params.categorieName
      );
    }
  }, [route]);

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const renderItem = ({ item }: { item: fileItemCategorie }) => (
    <View style={styles.column}>
    <FileitemCategorie
      item={item}
      currentDir={currentDir}
      toggleSelect={toggleSelect}
      multiSelect={multiSelect}
      setTransferDialog={setDestinationDialogVisible}
      setMoveOrCopy={setMoveOrCopy}
      deleteSelectedFiles={deleteSelectedFiles}
      setRenamingFile={setRenamingFile}
      setRenameDialogVisible={setRenameDialogVisible}
      setNewFileName={setNewFileName}
    ></FileitemCategorie>
    </View>
  );

  const handleDownload = (downloadUrl: string) => {
    axios
      .get(downloadUrl)
      .then((res) => {
        const fileExt = mime.extension(res.headers['content-type']);
        FileSystem.downloadAsync(
          downloadUrl,
          currentDir + '/DL_' + moment().format('DDMMYHmmss') + '.' + fileExt
        )
          .then(() => {
            getCategories();
            setDownloadDialogVisible(false);
            handleSetSnack({
              message: 'Download complete',
            });
          })
          .catch((_) => {
            handleSetSnack({
              message: 'Please provide a correct url',
            });
          });
      })
      .catch((error: AxiosError) =>
        handleSetSnack({
          message: error.message,
        })
      );
  };

  const toggleSelect = (item: fileItemCategorie) => {
    if (item.selected && selectedFiles.includes(item)) {
      const index = selectedFiles.indexOf(item);
      if (index > -1) {
        selectedFiles.splice(index, 1);
      }
    } else if (!item.selected && !selectedFiles.includes(item)) {
      setSelectedFiles((prev) => [...prev, item]);
    }
    setFiles(
      files.map((i) => {
        if (item === i) {
          i.selected = !i.selected;
        }
        return i;
      })
    );
  };

  const toggleSelectAll = () => {
    if (!allSelected) {
      setFiles(
        files.map((item) => {
          item.selected = true;
          return item;
        })
      );
      setSelectedFiles(files);
    } else {
      setFiles(
        files.map((item) => {
          item.selected = false;
          return item;
        })
      );
      setSelectedFiles([]);
    }
  };

  const getCategories = async () => {
    FileSystem.readDirectoryAsync(currentDir + '/categorie/')
      .then((dirFiles) => {
        if (currentDir !== route?.params?.prevDir) {
          const filteredFiles = dirFiles.filter(
            (file) => file !== 'RCTAsyncLocalStorage'
          );
          const filesProms = filteredFiles.map((fileName) =>
            FileSystem.getInfoAsync(currentDir + '/categorie/' + fileName)
          );
          Promise.all(filesProms).then((results) => {
            let tempfiles: fileItemCategorie[] = results.map((file) => {
              const name = file.uri.endsWith('/')
                ? file.uri
                    .slice(0, file.uri.length - 1)
                    .split('/')
                    .pop()
                : file.uri.split('/').pop();
              return Object({
                ...file,
                name,
                selected: false,
              });
            });
            setFiles(tempfiles);
            const tempImageFiles = results.filter((file) => {
              let fileExtension = file.uri
                .split('/')
                .pop()
                .split('.')
                .pop()
                .toLowerCase();
              if (imageFormats.includes(fileExtension)) {
                return file;
              }
            });
            dispatch(setImages(tempImageFiles));
          });
        }
      })
      .catch((_) => {});
  };

  async function createCategorie(name: string, keywords: string[]) {
    const categoryPath = currentDir + '/categorie/' + name;
  
    // Create the category directory
    FileSystem.makeDirectoryAsync(categoryPath)
      .then(() => {
        // Optionally, store keywords or perform any additional actions with keywords
        getCategories();
        setCategorieDialogVisible(false);
      })
      .catch(() => {
        handleSetSnack({
          message: 'Category could not be created or already exists.',
        });
      });
  }

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.error('Sorry, we need camera roll permissions to make this work!');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        const { uri, type } = result as ImageInfo;
        const filename: string = uri.replace(/^.*[\\\/]/, '');
        const ext: string | null = reExt.exec(filename)![1];
        const fileNamePrefix = type === 'image' ? 'IMG_' : 'VID_';
  
        await FileSystem.moveAsync({
          from: uri,
          to: currentDir + '/categorie/' + fileNamePrefix + moment().format('DDMMYHmmss') + '.' + ext,
        });
  
        getCategories();
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };
  
  async function handleCopy(
    from: string,
    to: string,
    successMessage: string,
    errorMessage: string
  ): Promise<void> {
    FileSystem.copyAsync({ from, to })
      .then(() => {
        getCategories();
        handleSetSnack({
          message: successMessage,
        });
      })
      .catch(() =>
        handleSetSnack({
          message: errorMessage,
        })
      );
  }

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
    });

    if (result.type === 'success') {
      const { exists: fileExists } = await FileSystem.getInfoAsync(
        currentDir + '/' + result.name
      );
      if (fileExists) {
        Alert.alert(
          'Conflicting File',
          `The destination categorie has a file with the same name ${result.name}`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Replace the file',
              onPress: () => {
                handleCopy(
                  result.uri,
                  currentDir + '/' + result.name,
                  `${result.name} successfully copied.`,
                  'An unexpected error importing the file.'
                );
              },
              style: 'default',
            },
          ]
        );
      } else {
        handleCopy(
          result.uri,
          currentDir + '/' + result.name,
          `${result.name} successfully copied.`,
          'An unexpected error importing the file.'
        );
      }
    }
  };

  const onMultiSelectSubmit = async (data: ExtendedAsset[]) => {
    const transferPromises = data.map((file) =>
      FileSystem.copyAsync({
        from: file.uri,
        to: currentDir + '/categorie/' + file.filename,
      })
    );
    Promise.all(transferPromises).then(() => {
      setMultiImageVisible(false);
      getCategories();
    });
  };

  const moveSelectedFiles = async (destination: string) => {
    const selectedFiles = files.filter((file) => file.selected);
  
    // Vérifiez et créez le répertoire de destination s'il n'existe pas
    try {
      const dirInfo = await FileSystem.getInfoAsync(destination + '/categorie');
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(destination + '/categorie', { intermediates: true });
      }
    } catch (error) {
      console.error('Error creating destination directory:', error);
      handleSetSnack({
        message: 'Error creating destination directory.',
      });
      return;
    }
  
    const destinationCategorieFiles = await FileSystem.readDirectoryAsync(destination + '/categorie');
    
    function executeTransfer() {
      const transferPromises = selectedFiles.map((file) => {
        const destPath = `${destination}/categorie/${file.name}`;
        return moveOrCopy === 'Copy'
          ? FileSystem.copyAsync({ from: `${currentDir}/categorie/${file.name}`, to: destPath })
          : FileSystem.moveAsync({ from: `${currentDir}/categorie/${file.name}`, to: destPath });
      });
      
      allProgress(transferPromises, (p) => {}).then((_) => {
        setDestinationDialogVisible(false);
        setMoveDir('');
        setMoveOrCopy('');
        getCategories();
      }).catch((error) => {
        console.error('Error during file transfer:', error);
        handleSetSnack({
          message: 'Error during file transfer.',
        });
      });
    }
  
    const conflictingFiles = selectedFiles.filter((file) => destinationCategorieFiles.includes(file.name));
    const confLen = conflictingFiles.length;
    if (confLen > 0) {
      Alert.alert(
        'Conflicting Files',
        `The destination Categorie has ${confLen} ${confLen === 1 ? 'file' : 'files'} with the same ${confLen === 1 ? 'name' : 'names'}.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Replace the files', onPress: executeTransfer, style: 'default' }
        ]
      );
    } else {
      executeTransfer();
    }
  };
  

  const deleteSelectedFiles = async (file?: fileItemCategorie) => {
    const filestoBeDeleted = file ? [file] : selectedFiles;
    const deleteProms = filestoBeDeleted.map((file) =>
      FileSystem.deleteAsync(file.uri)
    );
    Promise.all(deleteProms)
      .then((_) => {
        handleSetSnack({
          message: 'Files deleted!',
        });
        getCategories();
        setSelectedFiles([]);
      })
      .catch((err) => {
        console.log(err);
        getCategories();
      });
  };

  const [initialSelectionDone, setInitialSelectionDone] = useState(false);

  useEffect(() => {
    if (renameDialogVisible && Platform.OS === 'android') {
      setTimeout(() => {
        renameInputRef.current?.focus();
      }, 100);
    }
    if (!renameDialogVisible)
      setTimeout(() => {
        setInitialSelectionDone(false);
      }, 500);
  }, [renameDialogVisible]);

  const onRename = async () => {
    try {
      // Construisez le chemin du nouveau répertoire
      const filePathSplit = renamingFile.uri.split('/categorie/');
      const fileCategoriePath = filePathSplit
        .slice(0, filePathSplit.length - 1)
        .join('/categorie/');
      const newFilePath = `${fileCategoriePath}/categorie/${newFileName}`;
  
      // Vérifiez si un répertoire ou un fichier avec le nouveau nom existe déjà
      const fileInfo = await FileSystem.getInfoAsync(newFilePath);
      if (fileInfo.exists) {
        handleSetSnack({
          message: 'A category or file with the same name already exists.',
        });
        return;
      }
  
      // Renommez le fichier ou le répertoire
      await FileSystem.moveAsync({
        from: renamingFile.uri,
        to: newFilePath,
      });
  
      // Mettez à jour l'interface utilisateur
      setRenameDialogVisible(false);
      getCategories();
    } catch (error) {
      console.error('Error renaming the file/category:', error);
      handleSetSnack({
        message: 'Error renaming the file/category.',
      });
    }
  };
  

  const handleSetSnack = (data: snackActionPayload) => {
    dispatch(setSnack(data));
  };

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <ActionSheet
        title={'Add a new file'}
        numberOfLinesTitle={undefined}
        visible={newFileActionSheet}
        actionItems={[
          'Camera Roll',
          'Multi Image Picker',
          'Import File from Storage',
          'Download',
          'Cancel',
        ]}
        itemIcons={[
          'camera',
          'image',
          'drive-file-move-outline',
          'file-download',
          'close',
        ]}
        onClose={setNewFileActionSheet}
        onItemPressed={(buttonIndex) => {
          if (buttonIndex === 0) {
            pickImage();
          } else if (buttonIndex === 1) {
            setMultiImageVisible(true);
          } else if (buttonIndex === 2) {
            pickDocument();
          } else if (buttonIndex === 3) {
            setDownloadDialogVisible(true);
          }
        }}
        cancelButtonIndex={4}
        modalStyle={{ backgroundColor: colors.background2 }}
        itemTextStyle={{ color: colors.text }}
        titleStyle={{ color: colors.secondary }}
      />
      <CategoryTransferDialog
        isVisible={destinationDialogVisible}
        setIsVisible={setDestinationDialogVisible}
        currentDir={docDir}
        moveDir={moveDir}
        setMoveDir={setMoveDir}
        moveSelectedFiles={moveSelectedFiles}
        moveOrCopy={moveOrCopy}
        setMoveOrCopy={setMoveOrCopy}
      />
      <NewCategorieDialog
        visible={categorieDialogVisible}
        createCategorie={createCategorie}
        setCategorieDialogVisible={setCategorieDialogVisible}
      />

      <Dialog.Container visible={renameDialogVisible}>
        <Dialog.Title style={{ color: 'black' }}>Rename file</Dialog.Title>
        <Dialog.Input
          textInputRef={renameInputRef}
          value={decodeURI(newFileName)}
          onChangeText={(text) => {
            setNewFileName(text);
          }}
          onKeyPress={() => {
            setInitialSelectionDone(true);
          }}
          selection={
            !initialSelectionDone
              ? { start: 0, end: decodeURI(newFileName).split('.')[0].length }
              : undefined
          }
          style={{ color: 'black' }}
        ></Dialog.Input>
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setRenameDialogVisible(false);
          }}
        />
        <Dialog.Button label="Rename" onPress={() => onRename()} />
      </Dialog.Container>
      <GalleryDialog
        dialogStyle={{
          backgroundColor: colors.background2,
        }}
        animationType="slide"
        contentStyle={styles.contentStyle}
        overlayStyle={styles.overlayStyle}
        visible={multiImageVisible}
        onTouchOutside={() => setMultiImageVisible(false)}
      >
        <Pickimages
          onMultiSelectSubmit={onMultiSelectSubmit}
          onClose={() => setMultiImageVisible(false)}
        />
      </GalleryDialog>

      <ProgressDialog
        visible={importProgressVisible}
        title="Importing Assets"
        message="Please, wait..."
      />

      <View style={styles.topButtons}>
        <View style={styles.topLeft}>
          <TouchableOpacity onPress={() => setCategorieDialogVisible(true)}>
            <Feather name="inbox" size={30} color={colors.primary} />
          </TouchableOpacity>
        </View>
        {multiSelect && (
          <View style={styles.topRight}>
            <TouchableOpacity
              onPress={() => {
                setDestinationDialogVisible(true);
                setMoveOrCopy('Move');
              }}
            >
              <MaterialCommunityIcons
                name="file-move-outline"
                size={30}
                color={colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleSelectAll}>
              <Feather
                style={{ marginLeft: 10 }}
                name={allSelected ? 'check-square' : 'square'}
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={{ ...styles.fileList, borderTopColor: colors.primary }}>
        <FlatList
          data={files}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={_keyExtractor}
          numColumns={3}  // Ajoutez cette ligne pour spécifier le nombre de colonnes
        />
      </View>
      {multiSelect && (
        <View
          style={{ ...styles.bottomMenu, backgroundColor: colors.background }}
        >
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="export-variant"
              size={28}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      )}
      <ChatBox />
    </View>
  );
};

const _keyExtractor = (item: fileItemCategorie) => item.name;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SIZE,
    paddingTop: Constants.statusBarHeight,
  },
  topButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 10,
  },
  topLeft: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '25%',
  },
  topRight: {
    width: '75%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  fileList: {
    flex: 1,
    borderTopWidth: 0.5,
    marginTop: 15,
    marginHorizontal: 5,
  },
  bottomMenu: {
    height: 45,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  contentStyle: {
    width: SIZE,
    height: HEIGHT * 0.8,
    padding: 0,
    margin: 0,
  },
  overlayStyle: {
    width: SIZE,
    padding: 0,
    margin: 0,
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    width: '30%',
  },
});

export default Categorie;
