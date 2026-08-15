from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
REFERENCE = ROOT / "docs/public/images/cc-switch/platform-import-api-key.png"
OUTPUT = ROOT / "docs/public/images/quickstart/macos-api-quickstart.png"

WIDTH, HEIGHT = 1800, 1125


def font(size: int, mono: bool = False, bold: bool = False) -> ImageFont.FreeTypeFont:
    if mono:
        path = "/System/Library/Fonts/SFNSMono.ttf"
    elif bold:
        path = "/System/Library/Fonts/STHeiti Medium.ttc"
    else:
        path = "/System/Library/Fonts/Hiragino Sans GB.ttc"
    return ImageFont.truetype(path, size=size)


def rounded_panel(
    image: Image.Image,
    box: tuple[int, int, int, int],
    radius: int,
    fill: str,
    outline: str | None = None,
    shadow: tuple[int, int, int, int] = (0, 18, 42, 70),
) -> None:
    x1, y1, x2, y2 = box
    shadow_layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow_layer)
    shadow_draw.rounded_rectangle(
        (x1, y1 + 10, x2, y2 + 10),
        radius=radius,
        fill=shadow,
    )
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(20))
    image.alpha_composite(shadow_layer)

    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=1)


def fit_cover(source: Image.Image, size: tuple[int, int]) -> Image.Image:
    target_w, target_h = size
    scale = max(target_w / source.width, target_h / source.height)
    resized = source.resize(
        (round(source.width * scale), round(source.height * scale)),
        Image.Resampling.LANCZOS,
    )
    left = (resized.width - target_w) // 2
    top = (resized.height - target_h) // 2
    return resized.crop((left, top, left + target_w, top + target_h))


def paste_rounded(
    destination: Image.Image,
    source: Image.Image,
    position: tuple[int, int],
    radius: int,
) -> None:
    mask = Image.new("L", source.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, *source.size), radius=radius, fill=255)
    destination.paste(source, position, mask)


def badge(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    number: str,
    title: str,
    subtitle: str,
) -> None:
    x, y = xy
    draw.rounded_rectangle((x, y, x + 260, y + 78), radius=16, fill="#112c35", outline="#356872", width=1)
    draw.ellipse((x + 14, y + 17, x + 58, y + 61), fill="#58dcc5")
    draw.text((x + 36, y + 39), number, font=font(18, mono=True, bold=True), fill="#071b21", anchor="mm")
    draw.text((x + 72, y + 16), title, font=font(18, bold=True), fill="#ecf8f6")
    draw.text((x + 72, y + 45), subtitle, font=font(12), fill="#84a4ad")


def build() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    canvas = Image.new("RGBA", (WIDTH, HEIGHT), "#dce9ea")
    pixels = canvas.load()
    for y in range(HEIGHT):
        for x in range(WIDTH):
            glow = max(0, 1 - (((x - 1420) / 760) ** 2 + ((y - 160) / 640) ** 2))
            base = y / HEIGHT
            pixels[x, y] = (
                round(236 - 16 * base - 8 * glow),
                round(245 - 16 * base + 4 * glow),
                round(244 - 13 * base + 5 * glow),
                255,
            )

    draw = ImageDraw.Draw(canvas)
    for x in range(0, WIDTH, 64):
        draw.line((x, 0, x, HEIGHT), fill=(32, 97, 104, 18), width=1)
    for y in range(0, HEIGHT, 64):
        draw.line((0, y, WIDTH, y), fill=(32, 97, 104, 18), width=1)

    draw.text((90, 34), "NEXLY API / macOS QUICKSTART", font=font(14, mono=True, bold=True), fill="#315e67")
    draw.text((1710, 34), "DOC VISUAL 01", font=font(12, mono=True), fill="#6c8c93", anchor="ra")

    # MacBook display and base.
    rounded_panel(canvas, (70, 68, 1730, 1018), 38, "#07131d", "#24404a", (0, 25, 56, 84))
    draw = ImageDraw.Draw(canvas)
    draw.ellipse((892, 82, 908, 98), fill="#112732", outline="#34505a")
    draw.rounded_rectangle((96, 108, 1704, 975), radius=24, fill="#0a1923")
    draw.rounded_rectangle((48, 1000, 1752, 1042), radius=18, fill="#b9c8ca", outline="#8aa1a5")
    draw.rounded_rectangle((695, 1000, 1105, 1012), radius=6, fill="#90a6a9")
    draw.polygon([(48, 1020), (1752, 1020), (1660, 1060), (140, 1060)], fill="#a8b9bc")

    # macOS top bar.
    draw.rounded_rectangle((116, 126, 1684, 170), radius=12, fill="#101e29")
    draw.ellipse((136, 141, 150, 155), fill="#ff5f57")
    draw.ellipse((158, 141, 172, 155), fill="#febc2e")
    draw.ellipse((180, 141, 194, 155), fill="#28c840")
    draw.text((218, 138), "Nexly API 接入演示", font=font(15, bold=True), fill="#dcebea")
    draw.text((1648, 138), "09:41", font=font(13, mono=True), fill="#75909a", anchor="ra")

    # Browser window with the existing Nexly console screenshot.
    browser_box = (116, 188, 1030, 930)
    rounded_panel(canvas, browser_box, 22, "#101b24", "#31515b", (0, 14, 32, 65))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((116, 188, 1030, 236), radius=22, fill="#192832")
    draw.rectangle((116, 216, 1030, 236), fill="#192832")
    draw.ellipse((138, 205, 150, 217), fill="#ff5f57")
    draw.ellipse((158, 205, 170, 217), fill="#febc2e")
    draw.ellipse((178, 205, 190, 217), fill="#28c840")
    draw.rounded_rectangle((220, 198, 832, 226), radius=10, fill="#0e1b24")
    draw.text((238, 203), "nexlycn.guangnian.xin/keys", font=font(12, mono=True), fill="#9cb2ba")

    reference = Image.open(REFERENCE).convert("RGB")
    reference_view = fit_cover(reference, (886, 680))
    paste_rounded(canvas, reference_view, (130, 240), 14)

    # Keep callouts separate from the reference screenshot annotations.
    badge(draw, (138, 818), "01", "创建并保存 API Key", "控制台 · API 密钥")
    draw.line((398, 855, 504, 790), fill="#58dcc5", width=3)
    draw.ellipse((497, 783, 511, 797), fill="#58dcc5")

    # Terminal window.
    terminal_box = (1054, 188, 1684, 930)
    rounded_panel(canvas, terminal_box, 22, "#07121a", "#31515b", (0, 14, 32, 65))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((1054, 188, 1684, 236), radius=22, fill="#17252f")
    draw.rectangle((1054, 216, 1684, 236), fill="#17252f")
    draw.ellipse((1076, 205, 1088, 217), fill="#ff5f57")
    draw.ellipse((1096, 205, 1108, 217), fill="#febc2e")
    draw.ellipse((1116, 205, 1128, 217), fill="#28c840")
    draw.text((1369, 202), "Terminal — zsh", font=font(13, mono=True), fill="#9fb4bc", anchor="ma")

    mono = font(16, mono=True)
    mono_bold = font(16, mono=True, bold=True)
    small_mono = font(13, mono=True)
    x, y = 1082, 270
    line = 29

    draw.text((x, y), "$", font=mono_bold, fill="#62dfca")
    draw.text((x + 22, y), 'export NEXLY_API_KEY="••••••••"', font=mono, fill="#d6e4e6")
    y += line * 2
    draw.text((x, y), "$", font=mono_bold, fill="#62dfca")
    draw.text((x + 22, y), "curl https://nexlycn.guangnian.xin/", font=small_mono, fill="#8fc4ed")
    y += line
    draw.text((x + 22, y), "v1/models \\", font=small_mono, fill="#8fc4ed")
    y += line
    draw.text((x + 22, y), '-H "Authorization: Bearer', font=small_mono, fill="#d5c789")
    y += line
    draw.text((x + 22, y), '$NEXLY_API_KEY"', font=small_mono, fill="#d5c789")
    y += line * 2
    draw.text((x, y), "HTTP/2 200 OK", font=mono_bold, fill="#62dfca")
    y += line
    draw.text((x, y), '{ "data": [{', font=small_mono, fill="#98adb5")
    y += line
    draw.text((x + 20, y), '"id": "your-model-id"', font=small_mono, fill="#8fc4ed")
    y += line
    draw.text((x, y), "}] }", font=small_mono, fill="#98adb5")
    y += line * 2
    draw.text((x, y), "$", font=mono_bold, fill="#62dfca")
    draw.text((x + 22, y), 'export NEXLY_MODEL="your-model-id"', font=small_mono, fill="#d6e4e6")
    y += line * 2
    draw.text((x, y), "$", font=mono_bold, fill="#62dfca")
    draw.text((x + 22, y), "python quickstart.py", font=mono, fill="#d6e4e6")
    y += line * 2
    draw.rounded_rectangle((1080, y - 5, 1655, y + 64), radius=13, fill="#0d2e31", outline="#2b6967")
    draw.ellipse((1100, y + 17, 1110, y + 27), fill="#62dfca")
    draw.text((1126, y + 8), "Nexly API 连接成功", font=font(20, bold=True), fill="#dcf8f2")
    draw.text((1126, y + 37), "REQUEST COMPLETED · 200 OK", font=font(10, mono=True), fill="#70a8a5")

    badge(draw, (1076, 805), "02", "查询模型并发送请求", "Terminal · zsh")

    # Bottom flow ribbon.
    draw.rounded_rectangle((164, 948, 1636, 988), radius=12, fill="#0d2630", outline="#31515b")
    flow = ["API KEY", "MODEL ID", "REQUEST", "200 OK"]
    positions = [250, 650, 1050, 1450]
    for index, (label, px) in enumerate(zip(flow, positions, strict=True)):
        draw.ellipse((px - 6, 962, px + 6, 974), fill="#62dfca" if index == 3 else "#4f7480")
        draw.text((px + 16, 957), label, font=font(11, mono=True, bold=True), fill="#bdd0d4")
        if index < len(flow) - 1:
            draw.line((px + 92, 968, positions[index + 1] - 28, 968), fill="#31515b", width=2)

    draw.text(
        (900, 1094),
        "演示图：模型 ID 请以当前账号 /v1/models 返回结果为准，图中不包含真实 API Key。",
        font=font(13),
        fill="#54747b",
        anchor="ma",
    )

    canvas.convert("RGB").save(OUTPUT, quality=94, optimize=True)
    print(OUTPUT)


if __name__ == "__main__":
    build()
