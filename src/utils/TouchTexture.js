import { Texture } from "three";

// Hàm hỗ trợ làm mượt hiệu ứng
function outSine(n) {
  return Math.sin((n * Math.PI) / 2);
}

export default class TouchTexture {
  constructor({ size = 128, radius = 0.2, maxAge = 120, debugCanvas = false }) {
    this.options = { size, radius, maxAge, debugCanvas };

    // Biến trạng thái
    this.ctx = null;
    this.texture = null;
    this.trail = []; // Danh sách điểm chạm

    // Khởi tạo canvas
    this.initCanvas();
  }

  initCanvas() {
    // Tạo canvas 2D để lưu trạng thái touch
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = this.options.size;
    this.ctx = canvas.getContext("2d");

    // Đổ nền đen cho canvas
    if (this.ctx) {
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Tạo texture từ canvas
    this.texture = new Texture(canvas);
    this.texture.needsUpdate = true;

    // Debug canvas nếu cần hiển thị
    if (this.options.debugCanvas) {
      canvas.id = "touchTexture";
      canvas.style.position = "fixed";
      canvas.style.bottom = "0";
      canvas.style.zIndex = "10000";
      document.body.appendChild(canvas);
    }
  }

  addPoint(pointPos) {
    let force = 0;
    const last = this.trail.length ? this.trail[this.trail.length - 1] : null;

    if (last) {
      // Tính toán lực (force) dựa trên khoảng cách giữa điểm cũ và mới
      const dx = last.x - pointPos.x;
      const dy = last.y - pointPos.y;
      const dd = dx * dx + dy * dy;
      force = Math.min(dd * 10000, 1);
    }

    this.trail.push({ x: pointPos.x, y: pointPos.y, age: 0, force });
  }

  drawPoint(point) {
    const pos = {
      x: point.x * this.options.size,
      y: (1 - point.y) * this.options.size,
    };

    // Độ mạnh của vệt sáng theo tuổi
    let intensity = 1;
    if (point.age < this.options.maxAge * 0.3) {
      intensity = outSine(point.age / (this.options.maxAge * 0.3));
    } else {
      intensity = outSine(
        1 - (point.age - this.options.maxAge * 0.3) / (this.options.maxAge * 0.7)
      );
    }

    // Nhân cường độ với lực tác động (force)
    intensity *= point.force;

    // Tính bán kính của điểm sáng
    const radius = this.options.size * this.options.radius * intensity;

    // Tạo gradient cho hiệu ứng sáng
    const grd = this.ctx?.createRadialGradient(
      pos.x, pos.y, radius * 0.25, pos.x, pos.y, radius
    );

    // Thiết lập màu gradient
    grd?.addColorStop(0, "rgba(255, 255, 255, 0.35)");
    grd?.addColorStop(1, "rgba(0, 0, 0, 0.0)");

    // Vẽ điểm sáng
    this.ctx?.beginPath();
    if (this.ctx && grd) {
      this.ctx.fillStyle = grd;
    }
    this.ctx?.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    this.ctx?.fill();
  }

  update() {
    // Xóa canvas mỗi frame để làm mới hiệu ứng
    this.clear();

    // Tăng tuổi của điểm và xóa điểm cũ nếu quá maxAge
    this.trail.forEach((point, i) => {
      point.age++;
      if (point.age > this.options.maxAge) {
        this.trail.splice(i, 1);
      }
    });

    // Vẽ lại tất cả điểm touch
    this.trail.forEach((point) => {
      this.drawPoint(point);
    });

    if (this.texture) {
      this.texture.needsUpdate = true;
    }
  }

  clear() {
    // Xóa canvas về màu đen mỗi frame
    if (this.ctx) {
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, this.options.size, this.options.size);
    }
  }
}