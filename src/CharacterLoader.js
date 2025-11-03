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
  const [imageErrors, setImageErrors] = useState(new Set()); // Para rastrear imágenes que fallaron
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

  // Función para verificar si una imagen existe
  const verifyImageExists = async (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      // Timeout después de 3 segundos
      setTimeout(() => resolve(false), 3000);
    });
  };

  // Mapeo de nombres de personajes a IDs alternativos para búsqueda de imágenes
  const characterNameToImageMap = {
    'Adi Gallia': 'https://starwars-visualguide.com/assets/img/characters/46.jpg',
    'Ben Quadinaros': 'https://starwars-visualguide.com/assets/img/characters/47.jpg',
    'Cordé': 'https://starwars-visualguide.com/assets/img/characters/48.jpg',
    'Dexter Jettster': 'https://starwars-visualguide.com/assets/img/characters/49.jpg',
    'Dormé': 'https://starwars-visualguide.com/assets/img/characters/50.jpg',
    'Gasgano': 'https://starwars-visualguide.com/assets/img/characters/51.jpg',
    'Grievous': 'https://starwars-visualguide.com/assets/img/characters/79.jpg',
    'Lobot': 'https://starwars-visualguide.com/assets/img/characters/26.jpg',
    'Luminara Unduli': 'https://starwars-visualguide.com/assets/img/characters/64.jpg',
    'Mace Windu': 'https://starwars-visualguide.com/assets/img/characters/51.jpg',
    'Mon Mothma': 'https://starwars-visualguide.com/assets/img/characters/48.jpg',
    'Ratts Tyerel': 'https://starwars-visualguide.com/assets/img/characters/47.jpg',
    'Roos Tarpals': 'https://starwars-visualguide.com/assets/img/characters/46.jpg',
    'Rugor Nass': 'https://starwars-visualguide.com/assets/img/characters/45.jpg',
    'Saesee Tiin': 'https://starwars-visualguide.com/assets/img/characters/47.jpg',
    'San Hill': 'https://starwars-visualguide.com/assets/img/characters/48.jpg',
    'Shmi Skywalker': 'https://starwars-visualguide.com/assets/img/characters/49.jpg',
    'Sly Moore': 'https://starwars-visualguide.com/assets/img/characters/50.jpg',
    'Tion Medon': 'https://starwars-visualguide.com/assets/img/characters/51.jpg',
    'Wedge Antilles': 'https://starwars-visualguide.com/assets/img/characters/18.jpg',
    'Yarael Poof': 'https://starwars-visualguide.com/assets/img/characters/47.jpg'
  };

  // Función para buscar imagen por nombre del personaje
  const searchImageByName = async (characterName) => {
    // Primero verificar el mapeo directo
    if (characterNameToImageMap[characterName]) {
      const mappedUrl = characterNameToImageMap[characterName];
      const exists = await verifyImageExists(mappedUrl);
      if (exists) return mappedUrl;
    }

    // Crear slug del nombre para búsqueda
    const nameSlug = characterName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');

    // URLs posibles basadas en el nombre
    const searchUrls = [
      `https://starwars-visualguide.com/assets/img/characters/${nameSlug}.jpg`,
      `https://starwars-visualguide.com/assets/img/characters/${nameSlug}.png`,
      `https://images.starwars.com/characters/${nameSlug}.jpg`,
      `https://cdn.jsdelivr.net/npm/starwars-visualguide/assets/img/characters/${nameSlug}.jpg`
    ];

    // Intentar cada URL
    for (const url of searchUrls) {
      const exists = await verifyImageExists(url);
      if (exists) return url;
    }

    return null;
  };

  // Función para obtener imagen de múltiples fuentes (fallback)
  const getCharacterImageFromMultipleSources = async (character, characterId) => {
    // Primero verificar si hay un mapeo directo por nombre
    if (characterNameToImageMap[character.name]) {
      const mappedUrl = characterNameToImageMap[character.name];
      const exists = await verifyImageExists(mappedUrl);
      if (exists) return mappedUrl;
    }

    if (!characterId) {
      // Si no hay ID, intentar buscar por nombre
      return await searchImageByName(character.name);
    }

    // Lista de fuentes de imágenes en orden de prioridad
    const imageSources = [
      // 1. API de akabab (incluye imágenes en JSON)
      async () => {
        try {
          const response = await axios.get(`https://akabab.github.io/starwars-api/api/id/${characterId}.json`, { timeout: 3000 });
          if (response.data && response.data.image) {
            const imageUrl = response.data.image;
            const exists = await verifyImageExists(imageUrl);
            if (exists) return imageUrl;
          }
        } catch (e) {
          return null;
        }
      },
      
      // 2. Star Wars Visual Guide (formato estándar)
      async () => {
        const url = `https://starwars-visualguide.com/assets/img/characters/${characterId}.jpg`;
        const exists = await verifyImageExists(url);
        if (exists) return url;
        return null;
      },
      
      // 3. Star Wars Visual Guide (formato PNG)
      async () => {
        const url = `https://starwars-visualguide.com/assets/img/characters/${characterId}.png`;
        const exists = await verifyImageExists(url);
        if (exists) return url;
        return null;
      },
      
      // 4. Búsqueda por nombre del personaje en diferentes formatos
      async () => {
        const nameSlug = character.name.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        
        const urls = [
          `https://starwars-visualguide.com/assets/img/characters/${characterId}.jpg`,
          `https://cdn.jsdelivr.net/npm/starwars-visualguide/assets/img/characters/${characterId}.jpg`,
          `https://images.starwars.com/characters/${characterId}.jpg`,
          `https://starwars-visualguide.com/assets/img/characters/${nameSlug}.jpg`
        ];
        
        for (const url of urls) {
          const exists = await verifyImageExists(url);
          if (exists) return url;
        }
        return null;
      },
      
      // 5. Intentar con diferentes IDs cercanos (para casos donde el ID no coincide exactamente)
      async () => {
        const idsToTry = [characterId, parseInt(characterId) + 1, parseInt(characterId) - 1];
        for (const id of idsToTry) {
          if (id > 0) {
            const url = `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`;
            const exists = await verifyImageExists(url);
            if (exists) return url;
          }
        }
        return null;
      },
      
      // 6. Búsqueda por nombre como último intento antes del placeholder
      async () => {
        return await searchImageByName(character.name);
      },
      
      // 7. Imagen placeholder con el nombre del personaje
      async () => {
        // Usar placeholder como último recurso
        return `https://via.placeholder.com/400x600/667eea/ffffff?text=${encodeURIComponent(character.name.substring(0, 20))}`;
      }
    ];

    // Intentar cada fuente hasta encontrar una que funcione
    for (const source of imageSources) {
      try {
        const imageUrl = await source();
        if (imageUrl) {
          return imageUrl;
        }
      } catch (error) {
        continue; // Intentar siguiente fuente
      }
    }

    // Si todas fallan, usar placeholder genérico
    return `https://via.placeholder.com/400x600/667eea/ffffff?text=${encodeURIComponent(character.name.substring(0, 20))}`;
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
        const charactersWithImages = await Promise.all(
          response.data.results.map(async (character) => {
            // Extraer ID de la URL
            const idMatch = character.url.match(/\/(\d+)\/$/);
            const characterId = idMatch ? idMatch[1] : null;
            
            // Obtener imagen del personaje de múltiples fuentes
            let imageUrl = null;
            if (characterId) {
              // Intentar obtener imagen de múltiples fuentes con sistema de fallback
              imageUrl = await getCharacterImageFromMultipleSources(character, characterId);
            } else {
              // Si no hay ID, usar placeholder con el nombre
              imageUrl = `https://via.placeholder.com/400x600/667eea/ffffff?text=${encodeURIComponent(character.name.substring(0, 20))}`;
            }
            
            return {
              ...character,
              image: imageUrl
            };
          })
        );
        allChars = [...allChars, ...charactersWithImages];
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
          characters.map((character, index) => {
            const imageUrl = character.image || null;
            return (
              <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="h-100 shadow-sm">
                  {imageUrl && (
                    <div 
                      style={{ 
                        width: '100%', 
                        height: '250px', 
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        position: 'relative'
                      }}
                    >
                      {!imageErrors.has(character.url) ? (
                        <img
                          src={imageUrl}
                          alt={character.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                          onError={() => {
                            // Marcar esta imagen como error
                            setImageErrors(prev => new Set([...prev, character.url]));
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '3rem',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}>
                          ⭐
                        </div>
                      )}
                    </div>
                  )}
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
            );
          })
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

