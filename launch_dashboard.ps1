# Cloud Nexus 2030 - Dashboard Launcher
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Cyan
Write-Host "║     🚀 CLOUD NEXUS 2030 - DASHBOARD LAUNCHER 🚀          ║" -ForegroundColor White
Write-Host "║                                                          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Ouverture du dashboard dans votre navigateur..." -ForegroundColor Yellow
Write-Host ""

# Chemin du dashboard
# URL du dashboard
$dashboardUrl = "http://localhost:8080"

# Ouvrir dans le navigateur par défaut
Start-Process $dashboardUrl

Write-Host "✅ Dashboard ouvert avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "📊 9 modules disponibles :" -ForegroundColor Cyan
Write-Host "   1. Dashboard Principal" -ForegroundColor White
Write-Host "   2. Voice AI Builder" -ForegroundColor White
Write-Host "   3. Security Scanner" -ForegroundColor White
Write-Host "   4. Predictive CDN" -ForegroundColor White
Write-Host "   5. Live Pulse" -ForegroundColor White
Write-Host "   6. Servers Management" -ForegroundColor White
Write-Host "   7. CRM Dashboard" -ForegroundColor White
Write-Host "   8. Billing & Payments" -ForegroundColor White
Write-Host "   9. Settings" -ForegroundColor White
Write-Host ""
Write-Host "💡 Utilisez la sidebar pour naviguer entre les modules" -ForegroundColor Yellow
Write-Host ""
Write-Host "Appuyez sur une touche pour fermer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
