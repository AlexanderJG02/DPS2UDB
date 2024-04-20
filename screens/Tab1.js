import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const categories = [
  { label: 'Alimentación', value: 'Alimentación' },
  { label: 'Entretenimiento y Ocio', value: 'Entretenimiento y Ocio' },
  { label: 'Vivienda', value: 'Vivienda' },
  { label: 'Salud', value: 'Salud' },
  { label: 'Otros', value: 'Otros' }
];

const Tab1Screen = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState('0');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [errorFields, setErrorFields] = useState({ description: false, amount: false, category: false });

  useEffect(() => {
    const total = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
    setTotalExpense(total.toFixed(2));
  }, [expenses]);

  const handleSubmit = () => {
    let errors = { description: false, amount: false, category: false };

    if (!/^[a-zA-Z\s]*$/.test(description.trim())) {
      errors = { ...errors, description: true };
    }

    if (!description.trim()) {
      errors = { ...errors, description: true };
    }

    if (!amount.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      errors = { ...errors, amount: true };
    }

    if (!category) {
      errors = { ...errors, category: true };
    }

    if (Object.values(errors).some(field => field)) {
      setErrorFields(errors);
      setAlertMessage('Por favor, complete todos los campos correctamente.');
      setModalVisible(true);
      return;
    }

    const newExpense = { id: Date.now(), description, amount, category };
    setExpenses([...expenses, newExpense]);
    setDescription('');
    setAmount('');
    setCategory(null);
    setErrorFields({ description: false, amount: false, category: false });
  };

  const handleDeleteExpense = (id) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
  };

  const renderTotalExpense = () => {
    return (
      <View style={styles.item}>
        <View style={styles.itemContent}>
          <Text style={styles.itemDescription}>Gasto Total</Text>
          <Text style={styles.itemAmount}>${totalExpense}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={[styles.input, errorFields.description && styles.inputError]}
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={[styles.input, errorFields.amount && styles.inputError]}
          placeholder="Monto"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.dropdownHeader} onPress={() => setCategoryOpen(!categoryOpen)}>
          <Text style={[styles.dropdownHeaderText, errorFields.category && styles.dropdownHeaderTextError]}>
            {category ? category : "Seleccionar categoría"}
          </Text>
          <FontAwesome name={categoryOpen ? "chevron-up" : "chevron-down"} size={20} color="#555" />
        </TouchableOpacity>
        {categoryOpen && (
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setCategory(item.value);
                  setCategoryOpen(false);
                }}
              >
                <Text>{item.label}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.value}
            contentContainerStyle={styles.categoryListContent}
          />
        )}
        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <FontAwesome name="plus-circle" size={24} color="white" />
          <Text style={styles.addButtonText}>Agregar Gasto</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={[...expenses, { id: 'total', description: 'Total', amount: totalExpense, category: '' }]}
        renderItem={({ item, index }) => (
          item.id === 'total' ? renderTotalExpense() : (
            <View style={styles.item}>
              <TouchableOpacity onPress={() => handleDeleteExpense(item.id)}>
                <FontAwesome name="trash" size={20} color="red" />
              </TouchableOpacity>
              <View style={styles.itemContent}>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemAmount}>${item.amount}</Text>
                <Text style={styles.itemCategory}>Categoría: {item.category}</Text>
              </View>
            </View>
          )
        )}
        keyExtractor={(item, index) => item.id.toString()}
        contentContainerStyle={styles.expenseListContent}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.alertText}>{alertMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: 'red',
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  dropdownHeaderText: {
    fontSize: 16,
    color: '#555',
  },
  dropdownHeaderTextError: {
    color: 'red',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
  expenseListContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  itemContent: {
    flex: 1,
    marginLeft: 10,
  },
  itemDescription: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  categoryListContent: {
    flexGrow: 1,
  },
  expenseListContent: {
    flexGrow: 1,
  },
});

export default Tab1Screen;
