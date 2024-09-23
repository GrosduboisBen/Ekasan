import React, { useEffect, useRef, useState } from 'react';
import Dialog from 'react-native-dialog';
import { TextInput } from 'react-native-gesture-handler';
import { useAppSelector } from '../../hooks/reduxHooks';

type NewCategorieDialogProps = {
  visible: boolean;
  createCategorie: (name: string, keywords: string[]) => void;
  setCategorieDialogVisible: (visible: boolean) => void;
};

export const NewCategorieDialog = ({
  visible,
  createCategorie,
  setCategorieDialogVisible,
}: NewCategorieDialogProps) => {
  const { colors } = useAppSelector((state) => state.theme.theme);
  const [categorieName, setCategorieName] = useState('');
  const [newCategoryKeywords, setNewCategoryKeywords] = useState<string[]>([]); // Moved inside the component

  const newCategorieInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        newCategorieInputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  return (
    <Dialog.Container
      contentStyle={{ backgroundColor: colors.background2 }}
      visible={visible}
    >
      <Dialog.Title style={{ color: colors.primary }}>
        Add a new Categorie
      </Dialog.Title>
      <Dialog.Input
        textInputRef={newCategorieInputRef}
        style={{ color: colors.primary }}
        onChangeText={(text) => setCategorieName(text)}
      />
      <Dialog.Input
        placeholder="Keywords (comma-separated)"
        value={newCategoryKeywords.join(',')}
        onChangeText={(text) => setNewCategoryKeywords(text.split(','))}
        style={{ color: 'black' }}
      />
      <Dialog.Button
        label="Cancel"
        onPress={() => setCategorieDialogVisible(false)}
      />
      <Dialog.Button
        label="OK"
        onPress={() => {
          createCategorie(categorieName, newCategoryKeywords); // Pass keywords to createCategorie function
          setCategorieName('');
        }}
      />
    </Dialog.Container>
  );
};

