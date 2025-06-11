from flask import Blueprint, request, jsonify, send_file, render_template
from PIL import Image
import io

bp = Blueprint('esteganografia', __name__)

def str_to_bin(text):
    """Converte uma string em binário."""
    return ''.join(format(ord(c), '08b') for c in text)

def bin_to_str(binary):
    """Converte binário em string."""
    chars = [binary[i:i+8] for i in range(0, len(binary), 8)]
    return ''.join([chr(int(char, 2)) for char in chars])

def hide_text_in_image(image_data, secret_text):
    """Esconde texto em imagem usando LSB."""
    img = Image.open(io.BytesIO(image_data))
    img = img.convert('RGB')
    pixels = img.load()

    binary_text = str_to_bin(secret_text) + '1111111111111110'  # delimitador de fim
    idx = 0

    # Verificar se a mensagem cabe na imagem
    if len(binary_text) > (img.width * img.height * 3):
        raise ValueError("Mensagem muito grande para esta imagem")

    for y in range(img.height):
        for x in range(img.width):
            r, g, b = pixels[x, y]
            if idx < len(binary_text):
                r = (r & ~1) | int(binary_text[idx])
                idx += 1
            if idx < len(binary_text):
                g = (g & ~1) | int(binary_text[idx])
                idx += 1
            if idx < len(binary_text):
                b = (b & ~1) | int(binary_text[idx])
                idx += 1
            pixels[x, y] = (r, g, b)
            if idx >= len(binary_text):
                break
        if idx >= len(binary_text):
            break

    output = io.BytesIO()
    img.save(output, format='PNG')
    output.seek(0)
    return output.getvalue()

def extract_text_from_image(image_data):
    """Extrai texto da imagem."""
    img = Image.open(io.BytesIO(image_data))
    img = img.convert('RGB')
    pixels = img.load()

    binary_text = ''
    for y in range(img.height):
        for x in range(img.width):
            r, g, b = pixels[x, y]
            binary_text += str(r & 1)
            binary_text += str(g & 1)
            binary_text += str(b & 1)

    # Encontrar delimitador de fim
    end_index = binary_text.find('1111111111111110')
    if end_index != -1:
        binary_text = binary_text[:end_index]
        return bin_to_str(binary_text)
    else:
        return None

def validate_image_file(file):
    """Valida o arquivo de imagem enviado."""
    if not file:
        return "Nenhuma imagem enviada"
    
    if not file.filename:
        return "Nome de arquivo inválido"
        
    if not '.' in file.filename:
        return "Formato de arquivo inválido"
        
    ext = file.filename.rsplit('.', 1)[1].lower()
    if ext != 'png':
        return "Apenas imagens PNG são permitidas"
    
    return None

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/encode', methods=['POST'])
def encode():
    """Endpoint para codificar mensagem em imagem."""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'Nenhuma imagem enviada'}), 400
        
        if 'message' not in request.form:
            return jsonify({'error': 'Nenhuma mensagem enviada'}), 400
        
        image = request.files['image']
        message = request.form['message']
        
        error = validate_image_file(image)
        if error:
            return jsonify({'error': error}), 400
        
        image_data = image.read()
        try:
            processed_image = hide_text_in_image(image_data, message)
            return send_file(
                io.BytesIO(processed_image),
                mimetype='image/png',
                as_attachment=True,
                download_name='imagem_com_mensagem.png'
            )
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
    
    except Exception as e:
        return jsonify({'error': f"Erro ao processar imagem: {str(e)}"}), 500

@bp.route('/decode', methods=['POST'])
def decode():
    """Endpoint para decodificar mensagem de imagem."""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'Nenhuma imagem enviada'}), 400
        
        image = request.files['image']
        error = validate_image_file(image)
        if error:
            return jsonify({'error': error}), 400
        
        image_data = image.read()
        message = extract_text_from_image(image_data)
        
        if message is None:
            return jsonify({'error': 'Nenhuma mensagem encontrada na imagem ou delimitador não encontrado'}), 400
        
        return jsonify({'message': message})
    
    except Exception as e:
        return jsonify({'error': f"Erro ao decodificar mensagem: {str(e)}"}), 500
