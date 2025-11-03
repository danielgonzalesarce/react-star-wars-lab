// src/CharacterLoader.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, InputGroup, Spinner, Alert } from 'react-bootstrap';

function CharacterLoader() {
  const [characters, setCharacters] = useState([]);
  const [allCharacters, setAllCharacters] = useState([]); // Almacena todos los personajes cargados
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [massFilter, setMassFilter] = useState('');
  const [heightFilter, setHeightFilter] = useState('');
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Cargar el sonido cuando el componente se monta
  useEffect(() => {
    audioRef.current = new Audio('/007132146_prev.mp3');
    audioRef.current.volume = 0.5; // Ajusta el volumen (0.0 a 1.0)
    audioRef.current.preload = 'auto';
  }, []);

  // Función para reproducir el sonido
  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reiniciar el audio
      audioRef.current.play().catch(error => {
        console.warn('Error al reproducir sonido:', error);
      });
    }
  };

  // Función para cargar todos los personajes con paginación
  const loadAllCharacters = async () => {
    // Reproducir sonido al hacer click
    playSound();
    
    setLoading(true);
    setError(null);
    let allChars = [];
    let nextUrl = 'https://swapi.dev/api/people/';

    try {
      // Cargar todas las páginas
      while (nextUrl) {
        const response = await axios.get(nextUrl);
        allChars = [...allChars, ...response.data.results];
        nextUrl = response.data.next;
      }

      setAllCharacters(allChars);
      setCharacters(allChars);
    } catch (err) {
      console.error('Error al cargar personajes:', err);
      setError('Error al cargar los personajes. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Función para filtrar y ordenar personajes en tiempo real
  useEffect(() => {
    let filtered = [...allCharacters];

    // Filtro de búsqueda por nombre (funciona en tiempo real)
    // Busca personajes que empiecen con la letra o contengan el texto
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(character =>
        character.name.toLowerCase().includes(searchLower) ||
        character.name.toLowerCase().startsWith(searchLower)
      );
    }

    // Filtro por género
    if (genderFilter) {
      filtered = filtered.filter(character =>
        character.gender.toLowerCase() === genderFilter.toLowerCase()
      );
    }

    // Filtro por masa (peso)
    if (massFilter) {
      filtered = filtered.filter(character => {
        const mass = parseFloat(character.mass);
        const filterMass = parseFloat(massFilter);
        return !isNaN(mass) && mass >= filterMass;
      });
    }

    // Filtro por altura
    if (heightFilter) {
      filtered = filtered.filter(character => {
        const height = parseFloat(character.height);
        const filterHeight = parseFloat(heightFilter);
        return !isNaN(height) && height >= filterHeight;
      });
    }

    // Ordenar alfabéticamente por nombre
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    setCharacters(filtered);
  }, [searchTerm, genderFilter, massFilter, heightFilter, allCharacters]);

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Personajes de Star Wars</h1>

      {/* Barra de búsqueda en tiempo real */}
      <Row className="mb-4">
        <Col md={12}>
          <InputGroup size="lg">
            <InputGroup.Text>
              🔍
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar personajes (filtra automáticamente mientras escribes)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => setSearchTerm('')}
                title="Limpiar búsqueda"
              >
                ✕
              </Button>
            )}
          </InputGroup>
          {searchTerm && allCharacters.length > 0 && (
            <small className="text-muted mt-2 d-block">
              Buscando: "<strong>{searchTerm}</strong>" - {characters.length} resultado(s) encontrado(s)
            </small>
          )}
        </Col>
      </Row>

      {/* Filtros */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="">Todos los géneros</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="n/a">N/A</option>
            <option value="hermaphrodite">Hermafrodita</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Control
            type="number"
            placeholder="Masa mínima (kg)"
            value={massFilter}
            onChange={(e) => setMassFilter(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="number"
            placeholder="Altura mínima (cm)"
            value={heightFilter}
            onChange={(e) => setHeightFilter(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setSearchTerm('');
              setGenderFilter('');
              setMassFilter('');
              setHeightFilter('');
            }}
            className="w-100"
          >
            Limpiar filtros
          </Button>
        </Col>
      </Row>

      {/* Botón para cargar personajes */}
      <Row className="mb-4">
        <Col className="text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={loadAllCharacters}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Cargando Personajes...
              </>
            ) : (
              'Cargar Personajes'
            )}
          </Button>
        </Col>
      </Row>

      {/* Mensaje de error */}
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {/* Información de resultados */}
      {allCharacters.length > 0 && (
        <Row className="mb-3">
          <Col>
            <Alert variant="info" className="mb-0">
              Mostrando {characters.length} de {allCharacters.length} personajes
            </Alert>
          </Col>
        </Row>
      )}

      {/* Grid de personajes */}
      <Row>
        {characters.length > 0 ? (
          characters.map((character, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-primary">{character.name}</Card.Title>
                  <Card.Text>
                    <strong>Género:</strong> {character.gender || 'N/A'}<br />
                    <strong>Año de nacimiento:</strong> {character.birth_year}<br />
                    {character.mass && character.mass !== 'unknown' && (
                      <>
                        <strong>Masa:</strong> {character.mass} kg<br />
                      </>
                    )}
                    {character.height && character.height !== 'unknown' && (
                      <>
                        <strong>Altura:</strong> {character.height} cm<br />
                      </>
                    )}
                    {character.hair_color && character.hair_color !== 'n/a' && (
                      <>
                        <strong>Color de pelo:</strong> {character.hair_color}<br />
                      </>
                    )}
                    {character.eye_color && (
                      <>
                        <strong>Color de ojos:</strong> {character.eye_color}
                      </>
                    )}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : allCharacters.length === 0 && !loading ? (
          <Col>
            <Alert variant="secondary" className="text-center">
              Haz clic en "Cargar Personajes" para comenzar
            </Alert>
          </Col>
        ) : (
          <Col>
            <Alert variant="warning" className="text-center">
              No se encontraron personajes que coincidan con los filtros
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default CharacterLoader;

