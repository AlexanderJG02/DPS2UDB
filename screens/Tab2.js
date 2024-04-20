import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Image, Alert, TouchableOpacity, Animated, Modal } from 'react-native';

const Tab2Screen = () => {
  const [cards, setCards] = useState([]);
  const [salary, setSalary] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [hasEnteredSalary, setHasEnteredSalary] = useState(false); // Nuevo estado
  const fadeAnimation = useState(new Animated.Value(0))[0];
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Nuevo estado para mensaje de error

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('https://api.myjson.online/v1/records/4a0f9a14-7e0d-4380-ad68-4354ebeaee0b');
        const data = await response.json();
        setCards(data.data || []);
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }).start();
      } catch (error) {
        console.error('Error al obtener las tarjetas:', error);
        setErrorMessage('Error al obtener las tarjetas. Por favor, inténtalo de nuevo más tarde.');
      }
    };

    fetchCards();
  }, []);

  const handleCompare = () => {
    if (!salary.trim()) {
      setAlertMessage('Por favor, ingresa el monto de tu salario.');
      setModalVisible(true);
      return;
    }

    if (!/^\d+$/.test(salary)) {
      setAlertMessage('Por favor, ingresa solo números en el campo de salario.');
      setModalVisible(true);
      return;
    }

    if (!cards || !Array.isArray(cards)) {
      setAlertMessage('La lista de tarjetas no está inicializada correctamente.');
      setModalVisible(true);
      return;
    }

    if (parseFloat(salary.replace(',', '')) < 100) {
      setAlertMessage('El salario ingresado es menor a $100. No hay tarjetas disponibles para salarios tan bajos.');
      setModalVisible(true);
      return;
    }

    const filtered = cards.filter(
      card => parseFloat(card.ingresoMinimo.replace('$', '').replace(',', '')) <= parseFloat(salary)
    );
    setFilteredCards(filtered);
    setHasEnteredSalary(true); // Marcar que se ha ingresado un salario
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <Text style={styles.title}>Comparador de Tarjetas de Crédito</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu salario"
          value={salary}
          onChangeText={text => {
            setSalary(text);
            if (!text.trim()) {
              setHasEnteredSalary(false);
              setFilteredCards([]); // Limpiar las tarjetas filtradas si se borra el salario
            }
          }}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleCompare}>
          <Text style={styles.buttonText}>Comparar Tarjetas</Text>
        </TouchableOpacity>
      </View>
      {hasEnteredSalary && (
        <View style={{ flex: 1 }}>
          {filteredCards.length > 0 ? (
            <FlatList
              data={filteredCards}
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                  <Image source={{ uri: item.img }} style={styles.cardImage} />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.nombre}</Text>
                    <Text style={styles.cardText}>Institución: {item.institucion}</Text>
                    <Text style={styles.cardText}>Salario requerido: {item.ingresoMinimo}</Text>
                    <Text style={styles.cardText}>Tasa de interés: {item.tasaInteres}</Text>
                    <Text style={styles.cardText}>Beneficios: {item.beneficios}</Text>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <Text style={styles.noCardsText}>No hay tarjetas disponibles</Text>
          )}
        </View>
      )}
      {errorMessage !== '' && ( // Mostrar mensaje de error si hay un mensaje disponible
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.alertText}>{alertMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  noCardsText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  errorText: { // Estilo para el mensaje de error
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
    marginBottom: 10,
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
});

export default Tab2Screen;
