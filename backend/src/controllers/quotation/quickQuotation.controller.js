import QuickQuotation from "../../models/quotation/quickQuotation.model.js";
import Package from "../../models/package.model.js";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// Resolve local image path (logo)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logoPath = path.join(__dirname, "../../../public/logoiconic.jpg");

// Read image and convert to Base64
const logoBase64 = fs.existsSync(logoPath)
    ? fs.readFileSync(logoPath).toString("base64")
    : null;

const logoSrc = logoBase64
    ? `data:image/png;base64,${logoBase64}`
    : "https://www.iconicyatra.com/static/media/logo.7803301b9efb5c74d172.png";


// ==========================
// Create QuickQuotation
// ==========================
export const createQuickQuotation = async (req, res) => {
    try {
        const { customerName, email, phone, packageId, adults, children, message, totalCost } = req.body;

        if (!customerName || !email || !packageId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const pkg = await Package.findById(packageId).lean();
        if (!pkg) return res.status(404).json({ message: "Package not found" });

        const newQuotation = await QuickQuotation.create({
            customerName,
            email,
            phone,
            packageId,
            adults,
            children,
            message,
            totalCost: totalCost || pkg.price || 0,
            packageSnapshot: pkg,
            policy: pkg.policy,
        });

        res.status(201).json({
            message: "Quick quotation created successfully",
            quotation: newQuotation,
        });
    } catch (error) {
        console.error("Error creating quotation:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ==========================
// Get All Quick Quotations
// ==========================
export const getAllQuickQuotations = async (req, res) => {
    try {
        const quotations = await QuickQuotation.find()
            .populate("packageId", "packageName price duration")
            .sort({ createdAt: -1 });

        res.status(200).json({ count: quotations.length, quotations });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ==========================
// Get Single Quick Quotation
// ==========================
export const getQuickQuotationById = async (req, res) => {
    try {
        const quotation = await QuickQuotation.findById(req.params.id)
            .populate("packageId", "packageName price duration");

        if (!quotation)
            return res.status(404).json({ message: "Quotation not found" });

        res.status(200).json(quotation);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ==========================
// Update Quick Quotation
// ==========================
export const updateQuickQuotation = async (req, res) => {
    try {
        const updated = await QuickQuotation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated)
            return res.status(404).json({ message: "Quotation not found" });

        res.status(200).json({ message: "Quotation updated", quotation: updated });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ==========================
// Delete Quick Quotation
// ==========================
export const deleteQuickQuotation = async (req, res) => {
    try {
        const deleted = await QuickQuotation.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: "Quotation not found" });

        res.status(200).json({ message: "Quotation deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ==========================
// Manual Mail Sender (Callable)
// ==========================
export const sendQuotationMail = async (toEmail, customerName, pkg, quotation) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.gmail,
                pass: process.env.app_pass,
            },
        });

        const htmlContent = getQuotationEmailTemplate(customerName, pkg, quotation);

        await transporter.sendMail({
            from: `"Iconic Yatra" <${process.env.gmail}>`,
            to: toEmail,
            subject: `Your Quotation for ${pkg?.title || pkg?.packageName || "Tour Package"}`,
            html: htmlContent,
            attachments: [
                {
                    filename: "logoiconic.jpg",
                    path: logoPath,
                    cid: "logoiconic",
                },
            ],
        });

        console.log("Quotation email sent to:", toEmail);
        return { success: true, message: "Email sent successfully" };
    } catch (err) {
        console.error("Email sending failed:", err.message);
        return { success: false, message: err.message };
    }
};

// ==========================
// Send Quotation Mail (Manual Trigger)
// ==========================
export const sendQuickQuotationMail = async (req, res) => {
    try {
        const { id } = req.params; // quotation ID

        // Fetch quotation details from DB
        const quotation = await QuickQuotation.findById(id).populate("packageId");
        if (!quotation)
            return res.status(404).json({ message: "Quotation not found" });

        // Use packageSnapshot if available, otherwise use packageId
        const packageData = quotation.packageSnapshot || quotation.packageId;

        // Send the mail using existing reusable function
        const emailResult = await sendQuotationMail(
            quotation.email,
            quotation.customerName,
            packageData,
            quotation
        );

        if (!emailResult.success) {
            return res.status(500).json({
                success: false,
                message: "Failed to send quotation mail",
                error: emailResult.message,
            });
        }

        res.status(200).json({
            success: true,
            message: `Quotation mail sent successfully to ${quotation.email}`,
        });
    } catch (error) {
        console.error("Error sending quotation mail:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send quotation mail",
            error: error.message,
        });
    }
};

// ==========================
// Modern, Attractive Mail Template (FIXED)
// ==========================
const getQuotationEmailTemplate = (customerName, pkg, quotation) => {
    // Format total cost with commas
    const formatCurrency = (amount) => {
        if (!amount) return '0';
        return Math.round(amount).toLocaleString('en-IN');
    };

    // Calculate values from quotation data
    const totalAdults = quotation?.adults || 2;
    const totalChildren = quotation?.children || 0;
    const totalPax = totalAdults + totalChildren;

    // Calculate total cost with 5% GST
    const baseCost = quotation?.totalCost || pkg?.price || 0;
    const totalWithGST = Math.round(baseCost * 1.05);

    // Get package details from packageSnapshot
    const packageName = pkg?.title || pkg?.packageName || "Tour Package";
    const destination = pkg?.sector || pkg?.destinationCountry || 'N/A';
    const duration = pkg?.days?.length || 5;
    const nights = duration - 1 || 4;
    const mealPlan = pkg?.mealPlan?.planType || 'CP (Breakfast Only)';

    // Get transportation details from package
    const arrivalCity = pkg?.arrivalCity || 'Airport / Railway Station';
    const departureCity = pkg?.departureCity || 'Airport / Railway Station';

    // Get hotel details from destinationNights
    let hotelOptionsHTML = '';
    if (pkg?.destinationNights && Array.isArray(pkg.destinationNights)) {
        pkg.destinationNights.forEach((destinationNight) => {
            const destinationName = destinationNight.destination || 'Destination';
            const deluxeHotels = destinationNight.hotels?.filter(hotel =>
                hotel.category === 'deluxe' && hotel.hotelName && hotel.hotelName !== 'TBD'
            );

            if (deluxeHotels && deluxeHotels.length > 0) {
                deluxeHotels.forEach(hotel => {
                    hotelOptionsHTML += `<li><strong>${destinationName}:</strong> ${hotel.hotelName} (Deluxe Category)</li>`;
                });
            } else {
                // Default hotel options if no specific hotels found
                hotelOptionsHTML += `<li><strong>${destinationName}:</strong> Premium Deluxe Hotel (3★ Category)</li>`;
            }
        });
    }

    // If no hotel options found, show default
    if (!hotelOptionsHTML) {
        hotelOptionsHTML = `
            <li><strong>North Region:</strong> Premium Deluxe Hotel (3★ Category)</li>
            <li><strong>South Region:</strong> Luxury Resort (3★ Category)</li>
        `;
    }

    // Generate itinerary from days array
    let itineraryHTML = '';
    if (pkg?.days && Array.isArray(pkg.days) && pkg.days.length > 0) {
        itineraryHTML = pkg.days
            .map((day, index) => {
                const dayTitle = day.title || `Day ${index + 1}`;
                const dayDescription = day.aboutCity || day.notes || "Details will be shared soon.";
                return `<li><strong>${dayTitle}:</strong> ${dayDescription}</li>`;
            })
            .join("");
    } else {
        itineraryHTML = `<li>Itinerary details will be shared shortly.</li>`;
    }

    // Get stay locations for duration calculation
    let totalNightsFromStay = 0;
    if (pkg?.stayLocations && Array.isArray(pkg.stayLocations)) {
        totalNightsFromStay = pkg.stayLocations.reduce((total, location) => total + (location.nights || 0), 0);
    }

    const actualNights = totalNightsFromStay || nights;
    const actualDuration = actualNights + 1;

    return `
  <div style="font-family:'Segoe UI',Arial,sans-serif;color:#000;background:#fff;padding:0;margin:0;line-height:1.7;">
    <!-- HEADER -->
    <div style="background:#0b5394;color:#fff;text-align:center;padding:25px 15px;">
      <img src="cid:logoiconic" alt="Iconic Yatra" style="height:80px;margin-bottom:10px;border-radius:10px;">
      <h2 style="margin:5px 0 0;font-size:24px;">GREETING FROM ICONIC YATRA!!!</h2>
      <p style="margin:5px 0;font-size:15px;">Your Trusted Travel Partner</p>

     <!-- WEBSITE BUTTON -->
      <p style="text-align:center;margin:40px 0;">
        <a href="https://www.iconicyatra.com/" target="_blank"
          style="background:#ffc107;color:#000;padding:12px 25px;text-decoration:none;font-weight:600;border-radius:5px;">
          Visit Our Official Website
        </a>
      </p>
    </div>

    <!-- BODY -->
    <div style="padding:40px 30px;">
      <p>Dear <strong>${customerName}</strong>,</p>
      <p>Greetings from <strong>Iconic Yatra!!!</strong><br>
      As per discussion, please find below your customized <strong>${packageName}</strong> details and costing.</p>

      <!-- PACKAGE DETAILS -->
      <div style="background:#f9f9f9;padding:20px;border-left:4px solid #0b5394;margin:25px 0;">
        <h3 style="margin-top:0;color:#0b5394;">Package Summary</h3>
        <p><strong>Destination:</strong> ${destination}</p>
        <p><strong>No. of Pax:</strong> ${totalAdults} Adults, ${totalChildren} Child</p>
        <p><strong>Duration:</strong> ${actualNights} Nights / ${actualDuration} Days</p>
        <p><strong>Plan:</strong> ${mealPlan}</p>
        <p><strong>Hotel Type:</strong> Deluxe (3★ Category)</p>
        <p><strong>Transportation:</strong> Innova / Similar</p>
        <p><strong>Pick-Up:</strong> ${arrivalCity}</p>
        <p><strong>Drop:</strong> ${departureCity}</p>
        
        <!-- Total Cost Display -->
        <p><strong>Final Amount (including 5% GST):</strong> ₹${formatCurrency(totalWithGST)} INR</p>
      </div>

      <!-- HOTEL DETAILS -->
      <h3 style="color:#0b5394;">🏨 Hotel Options (Deluxe Category)</h3>
      <ul>
        ${hotelOptionsHTML}
      </ul>

      <!-- ITINERARY -->
      <h3 style="color:#0b5394;">🗓️ Day Wise Itinerary</h3>
      <ol style="margin:10px 0 25px 25px;">
        ${itineraryHTML}
      </ol>

      <!-- COST INCLUSION -->
      <h3 style="color:#0b5394;">✅ Cost Inclusions</h3>
      <ul>
        <li>Hotel accommodation as per the itinerary</li>
        <li>Daily ${mealPlan === 'CP' ? 'breakfast' : 'meals'} at the hotel</li>
        <li>Transportation as per the itinerary (Innova / Similar)</li>
        <li>All applicable taxes</li>
        <li>Pickup and drop from ${arrivalCity}</li>
        <li>All sightseeing as per itinerary</li>
      </ul>

      <!-- COST EXCLUSION -->
      <h3 style="color:#0b5394;">❌ Cost Exclusions</h3>
      <ul>
        <li>Personal expenses (Room Heater, Laundry, Tips, Telephone, Drinks, etc.)</li>
        <li>5% GST extra on package cost (if not included)</li>
        <li>Airfare / Train / Bus tickets</li>
        <li>Guide services, Entry tickets, Adventure activities (Direct payment by guest)</li>
        <li>Children above 5 years extra as per hotel policy</li>
        <li>Any other services not mentioned in inclusions</li>
      </ul>

      <!-- TERMS -->
      <h3 style="color:#0b5394;">📋 Terms & Conditions</h3>
      <p>Please visit: 
        <a href="https://www.iconicyatra.com/cancellation-refund-policy.html" style="color:#0b5394;text-decoration:none;">Cancellation & Refund Policy</a>
      </p>

      <!-- CANCELLATION POLICY -->
      <h3 style="color:#0b5394;">📜 Cancellation Policy</h3>
      <p>
        • Once booking is made: 18% Non-Refundable<br>
        • 60–45 Days before travel: 18% + 22% of package cost<br>
        • 44–30 Days: 18% + 42% of package cost<br>
        • 29–15 Days: 18% + 62% of package cost<br>
        • 14 Days or less / No show: 100% of total cost
      </p>

      <!-- PAYMENT POLICY -->
      <h3 style="color:#0b5394;">💳 Payment Policy</h3>
      <ul>
        <li>20% at the time of reservation + 100% of flight/train cost</li>
        <li>50% for random hotel confirmation</li>
        <li>30% after hotel confirmation mail from company</li>
      </ul>

      <!-- BANK DETAILS -->
      <h3 style="color:#0b5394;">🏦 Net Banking Payment Details</h3>
      <p>
        <strong>YES Bank</strong><br>
        <strong>Account Name:</strong> ICONIC YATRA<br>
        <strong>Account No:</strong> 001463400002757<br>
        <strong>IFSC Code:</strong> YESB0000014<br>
        <strong>Address:</strong> Block H1 A Sec 63, Noida, UP 201301
      </p>

      <p>
        <strong>KOTAK Bank</strong><br>
        <strong>Account Name:</strong> ICONIC YATRA<br>
        <strong>Account No:</strong> 7147083682<br>
        <strong>IFSC Code:</strong> KKBK0005033<br>
        <strong>Address:</strong> Sec 18, Noida, UP 201301
      </p>

      <p><em>All cards accepted (Credit/Debit cards attract 3.5% extra charge).</em></p>

      <!-- SIGNATURE -->
      <div style="margin-top:50px;text-align:left;">
        <p><strong>Thanks & Best Regards,</strong></p>
        <p><strong>Amit Jaiswal</strong><br>
        Mobile: +91-8130883907<br>
        Phone: +91-120-2555001 (Office)<br>
        Email: info@iconicyatra.com<br>
        Web: <a href="https://www.iconicyatra.com/" style="color:#0b5394;text-decoration:none;">www.iconicyatra.com</a></p>
      </div>
    </div>

    <!-- FOOTER -->
    <div style="background:#f1f1f1;text-align:center;padding:15px;font-size:12px;color:#555;">
      Corporate Office: B-25, 2nd Floor Sector -64, Noida, Uttar Pradesh 201301
    </div>
  </div>
  `;
};

export default getQuotationEmailTemplate;